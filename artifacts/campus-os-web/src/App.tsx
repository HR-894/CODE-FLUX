import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, FileText,
  LayoutDashboard, LocateFixed, MapPin, Menu, MessageSquareWarning, Plus, RefreshCw,
  Search, Send, Utensils, Users, X, type LucideIcon,
} from 'lucide-react';
import {
  getGetDashboardQueryKey, getGetSearchSuggestionsQueryKey, getListComplaintsQueryKey, useCreateComplaint,
  useExtractNextComplaint, useGetDashboard, useGetMenu, useGetSearchSuggestions,
  useGetTimetable, useListComplaints,
} from '@workspace/api-client-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { BRAND_CONFIG } from '@/config/branding';


type Filter = 'all' | 'open' | 'assigned' | 'resolved';
type Notice = { tone?: 'error' | 'success'; text: string };
type ComplaintForm = {
  title: string;
  description: string;
  category: 'facilities' | 'academics' | 'safety' | 'it' | 'dining';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
};

const ease = [0.22, 1, 0.36, 1] as const;
const enter = { hidden: { opacity: 0, y: 13 }, show: { opacity: 1, y: 0, transition: { duration: .45, ease } } };
const stagger = { show: { transition: { staggerChildren: .065 } } };

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
    { href: '/search', label: 'Campus search', icon: Search },
  ];
  const nav = (
    <nav className="rail-nav" aria-label="Primary navigation">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`rail-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileOpen(false)}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <Brand />
        <div className="nav-kicker">{BRAND_CONFIG.workspaceKicker}</div>
        {nav}
        <div className="rail-bottom">
          <div className="rail-status" data-testid="status-campus-systems">
            <div className="status-line"><span className="status-dot" /> {BRAND_CONFIG.statusText}</div>
            <div className="status-caption">{BRAND_CONFIG.statusSubtext}</div>
          </div>
        </div>
      </aside>
      <div className="main-frame">
        <div className="mobile-topbar">
          <div className="mobile-brand"><Brand compact /></div>
          <button className="mobile-menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-navigation">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && <motion.div className="mobile-drawer" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{nav}</motion.div>}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? undefined : 'brand-lockup'}>
      <div className="brand-mark">{BRAND_CONFIG.markText}</div>
      {!compact && (
        <div>
          <div className="brand-name">{BRAND_CONFIG.appName}</div>
          <div className="brand-sub">{BRAND_CONFIG.tagline}</div>
        </div>
      )}
    </div>
  );
}

function PageHeader({ eyebrow, title, highlight, description, actions }: { eyebrow: string; title: string; highlight?: string; description: string; actions?: ReactNode }) {
  return <div className="top-row"><div><div className="eyebrow">{eyebrow}</div><h1 className="page-heading">{title} {highlight && <em>{highlight}</em>}</h1><p className="page-lede">{description}</p></div>{actions && <div className="header-actions">{actions}</div>}</div>;
}

function LoadingPanel({ rows = 3 }: { rows?: number }) {
  return <div className="panel" aria-label="Loading content" data-testid="loading-panel"><div className="panel-head"><div className="skeleton" style={{ width: 140, height: 17 }} /></div><div className="panel-body">{Array.from({ length: rows }, (_, index) => <div key={index} style={{ display: 'grid', gap: 9, marginBottom: 17 }}><div className="skeleton" style={{ width: `${58 + index * 12}%`, height: 13 }} /><div className="skeleton" style={{ width: `${37 + index * 8}%`, height: 10 }} /></div>)}</div></div>;
}

function ErrorState({ retry, label = 'Campus data is taking a moment' }: { retry?: () => void; label?: string }) {
  return <div className="error-state" data-testid="state-error"><strong>{label}</strong><span>Try the connection again and we will pick up where you left off.</span>{retry && <div style={{ marginTop: 16 }}><button className="button button-soft" onClick={retry} data-testid="button-retry"><RefreshCw /> Retry</button></div>}</div>;
}

function Overview() {
  const dashboard = useGetDashboard();
  const timetable = useGetTimetable();
  const menu = useGetMenu();
  const complaints = useListComplaints({ status: 'open' });
  const overview = dashboard.data;
  const greetingName = overview?.greeting?.replace(/^Good morning,\s*/i, '') || 'Aanya';
  const pulse = overview ? Math.round(overview.attendanceRate <= 1 ? overview.attendanceRate * 100 : overview.attendanceRate) : 92;
  const menuItem = menu.data?.[0];
  return (
    <main className="page-wrap">
      <PageHeader eyebrow="Tuesday · 08 October 2024" title="Good morning," highlight={greetingName} description="Your campus, at a glance. Keep an eye on what needs your attention and what is already moving." actions={<Link href="/complaints" className="button button-primary" data-testid="link-submit-complaint"><Plus /> Submit a complaint</Link>} />
      <motion.div className="summary-grid" variants={stagger} initial="hidden" animate="show">
        <Metric label="Active complaints" value={overview?.activeComplaints ?? 4} note="live queue" icon={MessageSquareWarning} />
        <Metric label="Resolved this week" value={overview?.resolvedThisWeek ?? 12} note="steady progress" icon={CheckCircle2} className="warm" />
        <Metric label="Average response" value={overview?.averageResponseHours ?? 6.4} suffix=" hrs" note="last 30 days" icon={Clock3} className="sunny" />
        <Metric label="Attendance rate" value={pulse} suffix="%" note="this term" icon={CalendarDays} />
      </motion.div>
      <div className="dashboard-grid">
        <div className="stack">
          <section className="panel pulse-card" data-testid="card-campus-pulse">
            <div className="panel-head"><div><h2 className="panel-title">Campus pulse</h2><div className="panel-kicker">Signals from your student day</div></div><Activity size={18} /></div>
            <div className="panel-body pulse-body"><div><div className="pulse-score" data-testid="text-campus-pulse">{pulse}<span>%</span></div><div className="pulse-caption">Your week is tracking well. The small stuff is already in motion.</div></div><div className="pulse-bars">{(overview?.priorityBreakdown || [{ label: 'Resolved', value: 64, color: '#3b9a8d' }, { label: 'Assigned', value: 42, color: '#eab950' }, { label: 'Open', value: 22, color: '#e6795f' }]).slice(0, 3).map((item) => <div className="pulse-bar-row" key={item.label}><span>{item.label}</span><div className="pulse-track"><div className="pulse-fill" style={{ width: `${Math.min(100, Math.max(10, item.value))}%`, background: item.color }} /></div><span>{item.value}</span></div>)}</div></div>
          </section>
          {complaints.isLoading ? <LoadingPanel rows={3} /> : complaints.isError ? <div className="panel"><ErrorState retry={() => complaints.refetch()} /></div> : <ComplaintPreview complaints={complaints.data || []} />}
          {dashboard.isLoading ? <LoadingPanel rows={3} /> : dashboard.isError ? <div className="panel"><ErrorState retry={() => dashboard.refetch()} /></div> : <ActivityPanel items={overview?.recentActivity || []} />}
        </div>
        <div className="stack">
          {timetable.isLoading ? <LoadingPanel rows={3} /> : timetable.isError ? <div className="panel"><ErrorState retry={() => timetable.refetch()} /></div> : <TimetablePanel entries={timetable.data || []} />}
          {menu.isLoading ? <LoadingPanel rows={2} /> : menu.isError ? <div className="panel"><ErrorState retry={() => menu.refetch()} /></div> : <MenuPanel item={menuItem} />}
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, suffix, note, icon: Icon, className = '' }: { label: string; value: number; suffix?: string; note: string; icon: LucideIcon; className?: string }) {
  return <motion.div className={`metric-card ${className}`} variants={enter} data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="metric-label">{label}</div><div className="metric-value">{value}<span className="metric-suffix">{suffix}</span></div><div className="metric-note"><Icon size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {note}</div></motion.div>;
}

function ComplaintPreview({ complaints }: { complaints: Array<{ id: string; title: string; description: string; status: string; priorityLabel: string; location: string }> }) {
  return <section className="panel" data-testid="card-active-complaints"><div className="panel-head"><div><h2 className="panel-title">Needs your attention</h2><div className="panel-kicker">Active complaint routing</div></div><Link href="/complaints" className="link-inline" data-testid="link-view-complaints">View all <ArrowUpRight size={13} style={{ verticalAlign: 'middle' }} /></Link></div>{complaints.length ? <div className="complaint-list">{complaints.slice(0, 3).map((complaint) => <ComplaintRow key={complaint.id} complaint={complaint} compact />)}</div> : <EmptyState icon={CheckCircle2} title="Clear queue" copy="No active complaints need a nudge right now." />}</section>;
}

function ActivityPanel({ items }: { items: Array<{ id: string; title: string; detail: string; time: string; tone: string }> }) {
  return <section className="panel" data-testid="card-recent-activity"><div className="panel-head"><div><h2 className="panel-title">Recent activity</h2><div className="panel-kicker">A quiet paper trail</div></div><Activity size={17} color="#3b9a8d" /></div><div className="panel-body activity-list">{items.length ? items.slice(0, 4).map((item) => <div className="activity-row" key={item.id}><span className={`activity-dot ${item.tone === 'rose' ? 'coral' : item.tone === 'amber' ? 'sun' : item.tone === 'indigo' ? 'lilac' : ''}`} /><div><div className="activity-title">{item.title}</div><div className="activity-detail">{item.detail}</div></div><div className="activity-time">{item.time}</div></div>) : <EmptyState icon={Activity} title="No updates yet" copy="Your campus activity will appear here." />}</div></section>;
}

function TimetablePanel({ entries }: { entries: Array<{ id: string; title: string; room: string; time: string; instructor: string; color: string }> }) {
  return <section className="panel" data-testid="card-timetable"><div className="panel-head"><div><h2 className="panel-title">Today's timetable</h2><div className="panel-kicker">Tuesday · 3 classes</div></div><CalendarDays size={17} color="#e6795f" /></div><div className="panel-body timetable-list">{entries.length ? entries.slice(0, 4).map((entry) => <div className="timetable-row" key={entry.id}><span className="time-accent" style={{ background: entry.color }} /><div><div className="time-title">{entry.title}</div><div className="time-meta">{entry.room} · {entry.instructor}</div></div><div className="time-clock">{entry.time}</div></div>) : <EmptyState icon={CalendarDays} title="A clear day" copy="Nothing is scheduled in your timetable today." />}</div></section>;
}

function MenuPanel({ item }: { item?: { meal: string; title: string; description: string; tags: string[] } }) {
  return <section className="panel" data-testid="card-dining"><div className="panel-head"><div><h2 className="panel-title">Dining context</h2><div className="panel-kicker">North Quad · today's menu</div></div><Utensils size={17} color="#eab950" /></div><div className="panel-body">{item ? <div className="menu-feature"><div className="menu-art" aria-hidden="true" /><div><div className="meal-label">{item.meal}</div><div className="menu-title">{item.title}</div><div className="menu-desc">{item.description}</div><div className="tag-list">{(item.tags || []).slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div></div> : <EmptyState icon={Utensils} title="Menu is quiet" copy="Dining details will show here when available." />}</div></section>;
}

function ComplaintsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const queryClient = useQueryClient();
  const params = { status: filter === 'all' ? undefined : filter as 'open' | 'assigned' | 'resolved' };
  const complaints = useListComplaints(params);
  const nextComplaint = useExtractNextComplaint();
  const list = complaints.data || [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey(params) });
  const claimNext = () => nextComplaint.mutate(undefined, { onSuccess: (complaint) => { setNotice({ text: complaint ? `Next priority: ${complaint.title}` : 'The queue is clear.' }); }, onError: () => setNotice({ tone: 'error', text: 'Could not inspect the priority queue.' }) });
  return <main className="page-wrap">
    <PageHeader eyebrow="Operations desk" title="Complaints," highlight="routed." description="A transparent view of what students have raised, where it lives, and how the campus is responding." actions={<><button className="button button-soft" onClick={claimNext} disabled={nextComplaint.isPending} data-testid="button-extract-next"><LocateFixed /> {nextComplaint.isPending ? 'Checking queue' : 'Find next priority'}</button><button className="button button-primary" onClick={() => setShowForm(true)} data-testid="button-open-complaint-form"><Plus /> New complaint</button></>} />
    <div className="complaint-toolbar"><div className="filter-tabs" role="tablist" aria-label="Complaint status filters">{(['all', 'open', 'assigned', 'resolved'] as Filter[]).map((item) => <button key={item} className={`filter-tab ${filter === item ? 'active' : ''}`} role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} data-testid={`button-filter-${item}`}>{item === 'all' ? 'All complaints' : statusLabel(item)}</button>)}</div><div className="panel-kicker">{list.length} records · live priority order</div></div>
    <section className="panel" data-testid="card-complaint-list">{complaints.isLoading ? <LoadingPanel rows={5} /> : complaints.isError ? <ErrorState retry={() => complaints.refetch()} /> : list.length ? <motion.div className="complaint-list" variants={stagger} initial="hidden" animate="show">{list.map((complaint) => <motion.div variants={enter} key={complaint.id}><ComplaintRow complaint={complaint} /></motion.div>)}</motion.div> : <EmptyState icon={MessageSquareWarning} title={filter === 'all' ? 'Nothing in the queue' : `No ${statusLabel(filter).toLowerCase()} complaints`} copy="This view is clear. New reports will be routed here as they arrive." action={<button className="button button-teal" onClick={() => setShowForm(true)} data-testid="button-empty-new-complaint"><Plus /> Submit a complaint</button>} />}</section>
    <AnimatePresence>{showForm && <ComplaintDialog onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); refresh(); queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); setNotice({ text: 'Complaint submitted and routed.' }); }} />}</AnimatePresence>
    <AnimatePresence>{notice && <motion.div className="notice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onAnimationComplete={() => window.setTimeout(() => setNotice(null), 3600)} data-testid="status-notice">{notice.text}</motion.div>}</AnimatePresence>
  </main>;
}

function ComplaintRow({ complaint, compact = false }: { complaint: { id: string; title: string; description: string; category?: string; severity?: string; status: string; location: string; createdAt?: string; priority?: number; priorityLabel: string }; compact?: boolean }) {
  return <div className="complaint-row" data-testid={`row-complaint-${complaint.id}`}><div><h3 className="complaint-title">{complaint.title}</h3><p className="complaint-description">{compact && (complaint.description || '').length > 110 ? `${(complaint.description || '').slice(0, 110)}…` : (complaint.description || 'No description provided')}</p><div className="complaint-meta"><span className="meta-pin"><MapPin /> {complaint.location}</span>{!compact && complaint.createdAt && <><span>·</span><span>{new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></>}{!compact && complaint.category && <><span>·</span><span>{complaint.category}</span></>}</div></div><div className="badges"><span className={`badge badge-${complaint.severity || 'low'}`}>{complaint.priorityLabel || `${complaint.priority || 0} priority`}</span><span className={`badge ${complaint.status === 'assigned' ? 'badge-assigned' : 'badge-status'}`}>{statusLabel(complaint.status)}</span></div></div>;
}

function ComplaintDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const create = useCreateComplaint();
  const [form, setForm] = useState<ComplaintForm>({ title: '', description: '', category: 'facilities', severity: 'medium', location: '' });
  const [error, setError] = useState('');
  const update = <K extends keyof ComplaintForm>(key: K, value: ComplaintForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = () => {
    if (form.title.trim().length < 5 || form.description.trim().length < 10 || form.location.trim().length < 2) { setError('Add a little more detail so the right campus team can pick this up.'); return; }
    setError('');
    create.mutate({ data: { ...form, title: form.title.trim(), description: form.description.trim(), location: form.location.trim() } }, { onSuccess: onCreated, onError: () => setError('This could not be submitted. Check your connection and try again.') });
  };
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.section className="modal" role="dialog" aria-modal="true" aria-labelledby="complaint-dialog-title" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .25, ease }}><div className="modal-head"><div><h2 id="complaint-dialog-title" className="modal-title">Start a complaint</h2><p className="modal-copy">Give the routing desk enough signal to send this to the right team.</p></div><button className="icon-button" onClick={onClose} aria-label="Close complaint form" data-testid="button-close-complaint-form"><X /></button></div><div className="form-body"><div className="field full"><label className="field-label" htmlFor="complaint-title">What needs attention?</label><input id="complaint-title" className="field-input" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="A short, specific title" data-testid="input-complaint-title" /></div><div className="field full"><label className="field-label" htmlFor="complaint-description">Describe the issue</label><textarea id="complaint-description" className="field-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What happened, and what would a useful fix look like?" data-testid="input-complaint-description" /></div><div className="field-grid"><div className="field"><label className="field-label" htmlFor="complaint-category">Category</label><select id="complaint-category" className="field-select" value={form.category} onChange={(event) => update('category', event.target.value as ComplaintForm['category'])} data-testid="select-complaint-category"><option value="facilities">Facilities</option><option value="academics">Academics</option><option value="safety">Safety</option><option value="it">IT</option><option value="dining">Dining</option></select></div><div className="field"><label className="field-label" htmlFor="complaint-severity">Severity</label><select id="complaint-severity" className="field-select" value={form.severity} onChange={(event) => update('severity', event.target.value as ComplaintForm['severity'])} data-testid="select-complaint-severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div></div><div className="field full"><label className="field-label" htmlFor="complaint-location">Where is this happening?</label><input id="complaint-location" className="field-input" value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Building, room, or campus area" data-testid="input-complaint-location" /></div>{error && <div className="field-error" role="alert" data-testid="status-form-error">{error}</div>}<div className="form-footer"><button className="button button-ghost" onClick={onClose} data-testid="button-cancel-complaint">Cancel</button><button className="button button-teal" onClick={submit} disabled={create.isPending} data-testid="button-submit-complaint"><Send /> {create.isPending ? 'Routing…' : 'Submit for routing'}</button></div></div></motion.section></motion.div>;
}

function SearchPage() {
  const [search, setSearch] = useState('');
  const q = search.trim();
  const suggestions = useGetSearchSuggestions({ q: q || 'campus' }, { query: { enabled: q.length > 0, queryKey: getGetSearchSuggestionsQueryKey({ q: q || 'campus' }) } });
  const icons: Record<string, LucideIcon> = { directory: Users, event: CalendarDays, location: MapPin };
  return <main className="page-wrap"><PageHeader eyebrow="Campus index" title="Find your" highlight="place." description="Search the living reference layer of campus: people, places, and the events that make a day work." /><div className="search-shell"><div className="search-box"><Search aria-hidden="true" /><input autoFocus className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try “library”, “advising”, or “north quad”" aria-label="Search campus" data-testid="input-campus-search" /><span className="search-hint">type to search</span></div>{q ? <div className="suggestion-list" data-testid="list-search-suggestions">{suggestions.isLoading ? <div className="search-empty">Searching the campus index…</div> : suggestions.isError ? <ErrorState retry={() => suggestions.refetch()} /> : suggestions.data?.length ? suggestions.data.map((item) => { const Icon = icons[item.kind] || FileText; return <button className="suggestion-row" key={item.id} onClick={() => setSearch(item.label)} data-testid={`button-search-suggestion-${item.id}`}><span className="suggestion-icon"><Icon /></span><span><span className="suggestion-label">{item.label}</span><span className="suggestion-meta">{item.meta}</span></span><span className="suggestion-kind">{item.kind}</span></button>; }) : <div className="search-empty" data-testid="state-search-empty">No campus references match that yet.</div>}</div> : <div className="search-empty" style={{ marginTop: 20 }} data-testid="state-search-idle">Start with a building, service, or event.</div>}</div></main>;
}

function EmptyState({ icon: Icon, title, copy, action }: { icon: LucideIcon; title: string; copy: string; action?: ReactNode }) {
  return <div className="empty-state" data-testid={`state-empty-${title.toLowerCase().replaceAll(' ', '-')}`}><div className="empty-icon"><Icon /></div><h3>{title}</h3><p>{copy}</p>{action}</div>;
}

function statusLabel(status?: string) {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function NotFound() {
  return <main className="page-wrap"><PageHeader eyebrow="404 · off the map" title="That page is" highlight="not here." description="CampusOS only routes the places that help you get through your day." actions={<Link href="/" className="button button-primary" data-testid="link-back-overview"><LayoutDashboard /> Back to overview</Link>} /></main>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Shell><Switch><Route path="/" component={Overview} /><Route path="/complaints" component={ComplaintsPage} /><Route path="/search" component={SearchPage} /><Route component={NotFound} /></Switch></Shell></ErrorBoundary>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}

export default App;
