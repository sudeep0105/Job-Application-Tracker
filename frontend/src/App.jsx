import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownUp, ArrowRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, CircleHelp,
  Clock3, Filter, LayoutDashboard, LogOut, MoreHorizontal, Plus, Search, Settings2, Sparkles,
  TrendingUp, X,
} from 'lucide-react'
import { authApi, jobsApi } from './api'

const stages = ['Applied', 'Interview', 'Offer', 'Rejected']
const stageClass = (stage) => stage.toLowerCase()
const initialForm = {
  company: '', position: '', location: '', employmentType: 'Full-time', status: 'Applied',
  appliedDate: new Date().toISOString().slice(0, 10), salary: '', jobUrl: '', notes: '',
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('jobtrack-token'))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('jobtrack-user') || 'null'))
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All applications')
  const [newestFirst, setNewestFirst] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [menuId, setMenuId] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const loadApplications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setApplications(await jobsApi.list())
    } catch (e) {
      setError(e.message)
      if (e.message.toLowerCase().includes('token') || e.message.toLowerCase().includes('unauthorized')) logout()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) loadApplications()
  }, [token, loadApplications])

  useEffect(() => {
    if (!profileMenuOpen) return undefined

    function closeMenu(event) {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && profileMenuRef.current?.contains(event.target)) return
      setProfileMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [profileMenuOpen])

  function logout() {
    setProfileMenuOpen(false)
    localStorage.removeItem('jobtrack-token')
    localStorage.removeItem('jobtrack-user')
    setToken(null)
    setUser(null)
    setApplications([])
  }

  async function submitAuth(event) {
    event.preventDefault()
    setError('')
    try {
      const response = authMode === 'login'
        ? await authApi.login({ email: authForm.email, password: authForm.password })
        : await authApi.register(authForm)
      localStorage.setItem('jobtrack-token', response.token)
      localStorage.setItem('jobtrack-user', JSON.stringify({ name: response.name, email: response.email }))
      setUser({ name: response.name, email: response.email })
      setToken(response.token)
    } catch (e) {
      setError(e.message)
    }
  }

  async function submitApplication(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (modal?.id) await jobsApi.update(modal.id, form)
      else await jobsApi.create(form)
      setModal(null)
      await loadApplications()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function openForm(application = null) {
    setForm(application ? { ...initialForm, ...application, appliedDate: application.appliedDate || '' } : initialForm)
    setModal(application ? { id: application.id } : {})
    setMenuId(null)
    setError('')
  }

  function openDetails(application) {
    setForm({ ...initialForm, ...application, appliedDate: application.appliedDate || '' })
    setModal({ id: application.id, readOnly: true })
    setMenuId(null)
  }

  async function deleteApplication(id) {
    if (!window.confirm('Delete this application? This action cannot be undone.')) return
    setMenuId(null)
    try {
      await jobsApi.remove(id)
      setApplications((current) => current.filter((application) => application.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  const filteredApplications = useMemo(() => applications
    .filter((application) => filter === 'All applications' || application.status === filter)
    .filter((application) => `${application.company} ${application.position} ${application.location || ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => newestFirst
      ? (b.appliedDate || '').localeCompare(a.appliedDate || '')
      : (a.appliedDate || '').localeCompare(b.appliedDate || '')), [applications, filter, query, newestFirst])

  const counts = useMemo(() => ({
    total: applications.length,
    interview: applications.filter((app) => app.status === 'Interview').length,
    offers: applications.filter((app) => app.status === 'Offer').length,
    responseRate: applications.length ? Math.round((applications.filter((app) => ['Interview', 'Offer', 'Rejected'].includes(app.status)).length / applications.length) * 100) : 0,
  }), [applications])

  if (!token) {
    return (
      <main className="auth-page">
        <div className="auth-decoration decoration-one" /><div className="auth-decoration decoration-two" />
        <section className="auth-card">
          <a className="brand auth-brand" href="#"><span className="brand-mark"><BriefcaseBusiness size={19} /></span>jobtrack</a>
          <div className="auth-eyebrow"><Sparkles size={14} /> A little more organized</div>
          <h1>{authMode === 'login' ? 'Your next chapter starts here.' : 'Make your next move.'}</h1>
          <p className="auth-description">Keep every application, interview, and opportunity in one clear place.</p>
          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === 'register' && <label>Your name<input required autoComplete="name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Alex Morgan" /></label>}
            <label>Email address<input required type="email" autoComplete="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input required minLength="8" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="At least 8 characters" /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-primary auth-submit" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'}<ArrowRight size={16} /></button>
          </form>
          <p className="auth-switch">{authMode === 'login' ? 'New to JobTrack?' : 'Already have an account?'} <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError('') }}>{authMode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
          <div className="auth-foot"><CircleHelp size={14} /> Your job search deserves a better system.</div>
        </section>
        <aside className="auth-quote"><div className="quote-art"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="quote-stat"><TrendingUp size={20} /><span>Momentum looks good</span><strong>You're building something.</strong></div><div className="quote-mini mini-a"><Check size={13} /> Application tracked</div><div className="quote-mini mini-b"><CalendarDays size={13} /> Interview next week</div></div><p>“Small steps every day add up to big opportunities.”</p><span>YOUR CAREER, IN PROGRESS</span></aside>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><BriefcaseBusiness size={18} /></span>jobtrack<span className="brand-period">.</span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav><button className="nav-link active"><LayoutDashboard size={17} /> Overview</button></nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={16} /><strong>Keep the momentum</strong><p>Every application is a step closer to your next opportunity.</p></div>
          <button className="profile-button" onClick={logout}><span className="avatar">{(user?.name || user?.email || 'J').slice(0, 1).toUpperCase()}</span><span className="profile-copy"><strong>{user?.name || 'Your account'}</strong><small>{user?.email}</small></span><LogOut size={16} /></button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><span className="today-label"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><div className="profile-menu-wrapper" ref={profileMenuRef}><button className="profile-trigger" aria-label="Open profile menu" aria-expanded={profileMenuOpen} aria-haspopup="menu" onClick={() => setProfileMenuOpen((open) => !open)}><span className="avatar top-avatar">{(user?.name || user?.email || 'J').slice(0, 1).toUpperCase()}</span><ChevronDown size={14} /></button>{profileMenuOpen && <div className="profile-menu" role="menu"><div className="profile-menu-user"><strong>{user?.name || 'Your account'}</strong><span>{user?.email}</span></div><button className="profile-menu-signout" role="menuitem" onClick={logout}><LogOut size={15} /> Sign out</button></div>}</div></div></header>
        <div className="page-content">
          <div className="welcome-row"><div><div className="greeting">YOUR JOB SEARCH, AT A GLANCE</div><h1>Good things take <span>progress.</span></h1><p>Here's where your opportunities stand today.</p></div><button className="button button-primary add-button" onClick={() => openForm()}><Plus size={17} /> Add application</button></div>
          {error && <div className="notice-error">{error}<button aria-label="Dismiss error" onClick={() => setError('')}><X size={16} /></button></div>}
          <section className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Total applications</span><span className="stat-icon icon-blue"><BriefcaseBusiness size={17} /></span></div><strong>{counts.total}</strong><small><span className="stat-accent">{counts.total ? 'Keep showing up' : 'Your journey starts here'}</span></small><div className="stat-line line-blue" /></article>
            <article className="stat-card"><div className="stat-top"><span>In interview</span><span className="stat-icon icon-purple"><CalendarDays size={17} /></span></div><strong>{counts.interview}</strong><small>Opportunities in motion</small><div className="stat-line line-purple" /></article>
            <article className="stat-card"><div className="stat-top"><span>Offers received</span><span className="stat-icon icon-green"><Sparkles size={17} /></span></div><strong>{counts.offers}</strong><small>Here's to what's next</small><div className="stat-line line-green" /></article>
            <article className="stat-card"><div className="stat-top"><span>Response rate</span><span className="stat-icon icon-orange"><TrendingUp size={17} /></span></div><strong>{counts.responseRate}<em>%</em></strong><small>Applications with an update</small><div className="stat-line line-orange" /></article>
          </section>
          <section className="applications-panel">
            <div className="panel-heading"><div><h2>Your applications</h2><p>A thoughtful next step is still a step forward.</p></div><button className="button button-outline" onClick={() => openForm()}><Plus size={16} /> New application</button></div>
            <div className="toolbar"><div className="search-box"><Search size={16} /><input aria-label="Search applications" placeholder="Search company or role..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="filter-wrap"><Filter size={15} /><select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All applications</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select><ChevronDown size={14} /></div><button className="sort-button" onClick={() => setNewestFirst((value) => !value)}><ArrowDownUp size={15} /> {newestFirst ? 'Newest' : 'Oldest'}</button></div>
            <div className="table-wrap"><table><thead><tr><th>COMPANY & ROLE</th><th>STATUS</th><th>DATE APPLIED</th><th>LOCATION</th><th /></tr></thead>
              <tbody>{loading ? <tr><td colSpan="5"><div className="empty-state"><span className="loader" /> Loading your applications...</div></td></tr>
                : filteredApplications.length ? filteredApplications.map((app) => <tr key={app.id}><td><div className="company-cell"><span className={`company-logo logo-${(app.company || 'x').charCodeAt(0) % 6}`}>{(app.company || '?').slice(0, 1).toUpperCase()}</span><span><strong>{app.company}</strong><small>{app.position}</small></span></div></td><td><span className={`status-pill ${stageClass(app.status)}`}><i />{app.status}</span></td><td className="date-cell">{app.appliedDate ? new Date(`${app.appliedDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td><td className="location-cell">{app.location || '—'}</td><td className="row-action"><button className="icon-button" aria-label={`Actions for ${app.company}`} onClick={() => setMenuId(menuId === app.id ? null : app.id)}><MoreHorizontal size={19} /></button>{menuId === app.id && <div className="row-menu"><button onClick={() => openDetails(app)}>View details</button><button onClick={() => openForm(app)}>Edit application</button><button className="danger-action" onClick={() => deleteApplication(app.id)}>Delete application</button></div>}</td></tr>)
                  : <tr><td colSpan="5"><div className="empty-state"><span className="empty-icon"><BriefcaseBusiness size={21} /></span><strong>{query || filter !== 'All applications' ? 'No matching applications' : 'Your next opportunity starts here'}</strong><span>{query || filter !== 'All applications' ? 'Try adjusting your search or filters.' : 'Add your first application and keep the momentum going.'}</span>{!query && filter === 'All applications' && <button className="button button-primary empty-add" onClick={() => openForm()}><Plus size={15} /> Add an application</button>}</div></td></tr>}
              </tbody></table></div>
            <div className="panel-footer"><span>Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong> applications</span><span className="footer-note"><Clock3 size={13} /> Every step counts</span></div>
          </section>
          <footer className="page-footer"><span>Made for the next step in your career.</span><span><Settings2 size={14} /> Your progress is yours alone.</span></footer>
        </div>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null) }}><section className="application-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-kicker">{modal.readOnly ? 'APPLICATION DETAILS' : modal.id ? 'KEEP IT UP TO DATE' : 'A NEW OPPORTUNITY'}</span><h2 id="modal-title">{modal.readOnly ? 'Application details' : modal.id ? 'Edit application' : 'Add an application'}</h2><p>{modal.readOnly ? 'Everything you have saved about this opportunity.' : 'Capture the details now. You can update them anytime.'}</p></div><button className="icon-button" aria-label="Close dialog" onClick={() => setModal(null)}><X size={19} /></button></div>
        <form onSubmit={submitApplication}><fieldset disabled={modal.readOnly} className="form-fieldset"><div className="form-grid">
          <label>Company <b>*</b><input required maxLength="120" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Stripe" /></label>
          <label>Job title <b>*</b><input required maxLength="160" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Product Designer" /></label>
          <label>Location<input maxLength="160" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote, New York" /></label>
          <label>Employment type<select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Freelance</option></select></label>
          <label>Application status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
          <label>Date applied<input type="date" value={form.appliedDate} onChange={(e) => setForm({ ...form, appliedDate: e.target.value })} /></label>
          <label>Salary range<input maxLength="100" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. ₹3 LPA – ₹5 LPA" /></label>
          <label>Job posting URL<input type="url" maxLength="500" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} placeholder="https://" /></label>
          <label className="full-field">Notes<textarea rows="3" maxLength="2000" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Interview details, people to follow up with, or anything worth remembering..." /></label>
        </div></fieldset><div className="modal-actions">{modal.readOnly ? <button type="button" className="button button-primary" onClick={() => setModal(null)}>Done</button> : <><button type="button" className="button button-quiet" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving...' : <>{modal.id ? 'Save changes' : 'Save application'} <ArrowRight size={15} /></>}</button></>}</div></form>
      </section></div>}
    </div>
  )
}

export default App
