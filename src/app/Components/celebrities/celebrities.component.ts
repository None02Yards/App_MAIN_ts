

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface Person { id: number; name: string; profile_path: string | null; }
type RankDelta = Record<number, number>;
type TrendClass = 'up' | 'down' | 'none';
type ArrowSymbol = '▲' | '▼' | '—';
interface DeltaView { cls: TrendClass; symbol: ArrowSymbol; valueText: string; }

@Component({
  selector: 'app-celebrities',
  templateUrl: './celebrities.component.html',
  styleUrls: ['./celebrities.component.scss']
})
export class CelebritiesComponent implements OnInit {
  // one-strip toggle
  tab: 'rising' | 'ranking' = 'rising';

  // data
  rising:  Person[] = [];   // trending/day (∞ pages)
  ranking: Person[] = [];   // popular (∞ pages)

  // paging
  private risingPage  = 1;
  private rankingPage = 1;
  private loading = false;

  // dedupe per tab
  private seenRising  = new Set<number>();
  private seenRanking = new Set<number>();

  // baseline
  private weekIndex = new Map<number, number>();
  private weekPageLoaded = 0; 
  deltasRising:  RankDelta = {};
  deltasRanking: RankDelta = {};

  @ViewChild('listRow', { static: false }) listRow!: ElementRef<HTMLDivElement>;

  constructor(public api: DataService) {}

  ngOnInit(): void {
    this.loadFirstPage();
  }

  //  UI helpers 
  onTab(next: 'rising' | 'ranking') { this.tab = next; }

  peopleForTab(): Person[] { return this.tab === 'rising' ? this.rising : this.ranking; }

  trackById = (_: number, p: Person) => p.id;

  imgUrl(p: Person) {
    return p.profile_path
      ? `https://image.tmdb.org/t/p/w300${p.profile_path}`
      : 'assets/images/avatar-placeholder.jpg';
  }

  badgeFor(id: number): DeltaView {
    const map = this.tab === 'rising' ? this.deltasRising : this.deltasRanking;
    const d = map[id];
    if (d === undefined || d === 0) return { cls: 'none', symbol: '—', valueText: '' };
    const up = d > 0;
    return { cls: up ? 'up' : 'down', symbol: up ? '▲' : '▼', valueText: Math.abs(d).toLocaleString('en-US') };
  }

  // scroll(el: HTMLElement, dir: 'left' | 'right') {
  //   const amount = Math.min(420, el.clientWidth * 0.85);
  //   el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  //   this.maybeLoadMore(el);
  // }


scroll(el: HTMLElement, dir: 'left' | 'right') {
  const style = getComputedStyle(el);
  const cols = parseInt(style.getPropertyValue('--cols').trim() || '6', 10);

  const first = el.querySelector<HTMLElement>('.person');
  const itemW = first ? first.getBoundingClientRect().width : 0;
  const mr = first ? parseFloat(getComputedStyle(first).marginRight || '0') : 0;

  // 6 items + 5 gutters (for 6 columns)
  const amount = itemW * cols + mr * (cols - 1);
  el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
}


  
  maybeLoadMore(el: HTMLElement) {
    if (this.loading) return;
    const nearRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 200;
    if (!nearRight) return;

    if (this.tab === 'rising') this.loadMoreRising();
    else this.loadMoreRanking();
  }

  // ---------- Data loading ----------
  /** Load first page of day+popular and week baseline page 1 */
  private loadFirstPage() {
    this.loading = true;

    const dayUrl  = `${this.api.MovieAPI}/trending/person/day?api_key=${this.api.APIKey}&page=${this.risingPage}`;
    const weekUrl = `${this.api.MovieAPI}/trending/person/week?api_key=${this.api.APIKey}&page=1`;
    // you already have getPeople(page) or getData('person','popular',page)
    const popular$ = this.api.getPeople(this.rankingPage);

    forkJoin({
      day: this.api.fetchFromApi(dayUrl),
      week: this.api.fetchFromApi(weekUrl),
      pop: popular$
    })
    .pipe(map(({ day, week, pop }: any) => ({
      dayList:  this.sanitize(day),
      weekList: this.sanitize(week),
      popList:  this.sanitize(pop)
    })))
    .subscribe(({ dayList, weekList, popList }) => {
      // cache baseline (week page 1)
      this.ingestWeekPage(weekList, 1);

      // append day
      this.appendPeople(this.rising, this.seenRising, dayList);
      this.recomputeDeltasFor(this.rising, this.deltasRising);

      // append popular
      this.appendPeople(this.ranking, this.seenRanking, popList);
      this.recomputeDeltasFor(this.ranking, this.deltasRanking);

      this.loading = false;
    });
  }

  private loadMoreRising() {
    this.loading = true;
    this.risingPage += 1;

    const dayUrl  = `${this.api.MovieAPI}/trending/person/day?api_key=${this.api.APIKey}&page=${this.risingPage}`;

    forkJoin({
      day:  this.api.fetchFromApi(dayUrl),
      // ensure week baseline keeps up so new ids get deltas
      week: this.ensureWeekUpTo(this.risingPage)
    })
    .pipe(map(({ day }: any) => this.sanitize(day)))
    .subscribe((dayList) => {
      this.appendPeople(this.rising, this.seenRising, dayList);
      this.recomputeDeltasFor(this.rising, this.deltasRising);
      this.loading = false;
    });
  }

  private loadMoreRanking() {
    this.loading = true;
    this.rankingPage += 1;

    forkJoin({
      pop:  this.api.getPeople(this.rankingPage),
      week: this.ensureWeekUpTo(this.rankingPage)
    })
    .pipe(map(({ pop }: any) => this.sanitize(pop)))
    .subscribe((popList) => {
      this.appendPeople(this.ranking, this.seenRanking, popList);
      this.recomputeDeltasFor(this.ranking, this.deltasRanking);
      this.loading = false;
    });
  }

  // ---------- Helpers ----------
  private sanitize(resp: any): Person[] {
    return (resp?.results ?? []).filter((p: any) => !!p?.profile_path) as Person[];
  }

  private appendPeople(target: Person[], seen: Set<number>, incoming: Person[]) {
    for (const p of incoming) if (!seen.has(p.id)) { seen.add(p.id); target.push(p); }
  }

  private ingestWeekPage(weekList: Person[], page: number) {
    const pageOffset = (page - 1) * 20; // TMDb pages are 20 items
    weekList.forEach((p, i) => {
      if (!this.weekIndex.has(p.id)) this.weekIndex.set(p.id, pageOffset + i);
    });
    if (page > this.weekPageLoaded) this.weekPageLoaded = page;
  }

  private ensureWeekUpTo(page: number) {
    if (this.weekPageLoaded >= page) {
      return this.api.fetchFromApi(`${this.api.MovieAPI}/configuration?api_key=${this.api.APIKey}`).pipe(map(() => null));
    }
    const requests = [];
    for (let p = this.weekPageLoaded + 1; p <= page; p++) {
      const weekUrl = `${this.api.MovieAPI}/trending/person/week?api_key=${this.api.APIKey}&page=${p}`;
      requests.push(this.api.fetchFromApi(weekUrl).pipe(map((r: any) => ({ p, list: this.sanitize(r) }))));
    }
    return forkJoin(requests).pipe(map((arr: Array<{p: number; list: Person[]}>) => {
      arr.forEach(({ p, list }) => this.ingestWeekPage(list, p));
      return null;
    }));
  }

  private recomputeDeltasFor(list: Person[], out: RankDelta) {
    for (let i = 0; i < list.length; i++) {
      const id = list[i].id;
      const prev = this.weekIndex.get(id);
      if (prev !== undefined) out[id] = prev - i; // + => moved up vs week
    }
  }
}

