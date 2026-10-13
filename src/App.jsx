import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, BarChart3, Bell, CheckCircle2, ChevronRight, CircleHelp, Download, FileCheck2, Filter, LayoutDashboard, MessageSquare, MoreHorizontal, Search, ShieldAlert, SlidersHorizontal, UserRound, X } from 'lucide-react'
import { calculateRisk, getAgeDays, riskOptions, statusOptions } from './businessRules'
import { formatCurrency, initialExceptions } from './data'

const navItems = [['Overview', LayoutDashboard], ['Exception queue', FileCheck2]]

function App() {
  const [exceptions, setExceptions] = useState(initialExceptions)
  const [selectedId, setSelectedId] = useState('SRV-460034')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [risk, setRisk] = useState('All risk levels')
  const [owner, setOwner] = useState('All owners')
  const [companyCode, setCompanyCode] = useState('All company codes')
  const [plant, setPlant] = useState('All plants')
  const [notice, setNotice] = useState('')
  const [comment, setComment] = useState('')
  const [activeNav, setActiveNav] = useState('Overview')

  const filtered = useMemo(() => exceptions.filter((item) => {
    const search = query.toLowerCase()
    return (!search || [item.id, item.supplier, item.material].some((value) => value.toLowerCase().includes(search))) &&
      (status === 'All statuses' || item.status === status) &&
      (risk === 'All risk levels' || item.risk === risk) &&
        (owner === 'All owners' || item.owner === owner) &&
        (companyCode === 'All company codes' || item.companyCode === companyCode) &&
        (plant === 'All plants' || item.plant === plant)
      }), [exceptions, query, status, risk, owner, companyCode, plant])
  const selected = exceptions.find((item) => item.id === selectedId) || filtered[0]
  const exposure = exceptions.filter((item) => item.status !== 'Resolved').reduce((sum, item) => sum + item.amount, 0)
  const awaiting = exceptions.filter((item) => item.status === 'Awaiting Approval').length
  const averageAge = Math.round(exceptions.filter((item) => item.status !== 'Resolved').reduce((sum, item) => sum + getAgeDays(item.created), 0) / exceptions.filter((item) => item.status !== 'Resolved').length)

  function updateSelected(update) {
    setExceptions((items) => items.map((item) => item.id === selected.id ? { ...item, ...update } : item))
    setNotice('Exception updated and audit event recorded')
  }

  function exportReport() {
    const header = 'Document,Supplier,Amount,Status,Risk,Owner\n'
    const rows = filtered.map((item) => `${item.id},${item.supplier},${item.amount},${item.status},${item.risk},${item.owner}`).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv' }))
    link.download = 'bluearc-invoice-exceptions.csv'
    link.click()
    setNotice('Report exported as CSV')
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">B</div><div><strong>bluearc</strong><span>freight solutions</span></div></div>
      <div className="workspace-label">WORKSPACE <span>FY26 · Q4</span></div>
      <nav>{navItems.map(([label, Icon]) => <button className={activeNav === label ? 'nav-item active' : 'nav-item'} key={label} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Exception queue' && <b>{exceptions.length}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><SlidersHorizontal size={18} /><span>Rules & controls</span></button><button className="nav-item"><CircleHelp size={18} /><span>Help centre</span></button><div className="user"><div className="avatar">PS</div><div><strong>Sridevi S</strong><small>AP Operations</small></div><MoreHorizontal size={17} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Finance operations <ChevronRight size={15} /> <strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" title="Notifications"><Bell size={18} /><i /></button><button className="icon-button" title="Account"><UserRound size={18} /></button></div></header>
      <section className="page-heading"><div><p className="eyebrow">PROCURE-TO-PAY / SAP MM + FI</p><h1>Invoice exception control</h1><p className="lede">Resolve mismatches before they interrupt your supplier relationships.</p></div><div className="heading-actions"><span className="data-badge"><span /> Mock SAP data</span><button className="button secondary" onClick={exportReport}><Download size={16} /> Export report</button></div></section>
      {notice && <div className="notice"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice('')}><X size={16} /></button></div>}
      <section className="kpi-grid"><KpiCard label="Open exceptions" value={exceptions.filter((item) => item.status !== 'Resolved').length} trend="2 since yesterday" icon={ShieldAlert} tone="coral" /><KpiCard label="Awaiting approval" value={awaiting} trend="1 needs attention" icon={FileCheck2} tone="gold" /><KpiCard label="Financial exposure" value={formatCurrency(exposure)} trend="Across open items" icon={BarChart3} tone="mint" /><KpiCard label="Average ageing" value={`${averageAge} days`} trend="Target: under 5 days" icon={AlertTriangle} tone="blue" /><KpiCard label="SLA performance" value="87%" trend="↑ 4.2% this week" icon={CheckCircle2} tone="green" /></section>
      <section className="work-area">
        <div className="queue-panel panel"><div className="panel-header"><div><p className="eyebrow">LIVE QUEUE</p><h2>Exceptions <span>{filtered.length}</span></h2></div><button className="icon-button bordered" title="Filter options"><Filter size={17} /></button></div><div className="filters"><div className="search"><Search size={16} /><input aria-label="Search exceptions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search document, supplier..." /></div><select aria-label="Company code filter" value={companyCode} onChange={(event) => setCompanyCode(event.target.value)}><option>All company codes</option><option>1000</option><option>1400</option><option>2300</option></select><select aria-label="Plant filter" value={plant} onChange={(event) => setPlant(event.target.value)}><option>All plants</option><option>120</option><option>1102</option><option>1107</option><option>2301</option><option>2305</option></select><select aria-label="Owner filter" value={owner} onChange={(event) => setOwner(event.target.value)}><option>All owners</option><option>Priya Shah</option><option>Marcus Green</option><option>Lena Ortiz</option><option>Ram</option></select><select aria-label="Status filter" value={status} onChange={(event) => setStatus(event.target.value)}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select><select aria-label="Risk filter" value={risk} onChange={(event) => setRisk(event.target.value)}>{riskOptions.map((option) => <option key={option}>{option}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Document</th><th>Supplier</th><th>Amount</th><th>Status</th><th>Risk</th><th>Owner</th></tr></thead><tbody>{filtered.map((item) => <tr className={selected?.id === item.id ? 'selected' : ''} key={item.id} onClick={() => setSelectedId(item.id)}><td><strong>{item.id}</strong><small>{item.material}</small></td><td>{item.supplier}</td><td className="amount">{formatCurrency(item.amount)}</td><td><Status status={item.status} /></td><td><span className={`risk ${item.risk.toLowerCase()}`}><i />{item.risk}</span></td><td><div className="owner"><span>{item.owner.split(' ').map((name) => name[0]).join('')}</span>{item.owner.split(' ')[0]}</div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty"><Search size={22} /><strong>No exceptions match those filters</strong><span>Try clearing a filter or changing your search.</span></div>}</div></div>
        {selected && <DetailPanel item={selected} comment={comment} setComment={setComment} onUpdate={updateSelected} onNotice={setNotice} />}
      </section>
      <footer><span><span className="live-dot" /> Last synced 12 Oct 2026, 11:42</span><span>Demo environment · No live SAP connection</span></footer>
    </main>
  </div>
}

function KpiCard({ label, value, trend, icon: Icon, tone }) { return <div className="kpi"><div className={`kpi-icon ${tone}`}><Icon size={19} /></div><div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div></div> }
function Status({ status }) { return <span className={`status ${status.toLowerCase().replaceAll(' ', '-')}`}><i />{status}</span> }
function DetailPanel({ item, comment, setComment, onUpdate, onNotice }) {
  const calculated = calculateRisk(item)
  return <aside className="detail-panel panel"><div className="detail-header"><div><p className="eyebrow">SELECTED EXCEPTION</p><h2>{item.id}</h2></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="detail-summary"><div><span>Financial exposure</span><strong>{formatCurrency(item.amount)}</strong></div><Status status={item.status} /></div><div className="rule-note"><ShieldAlert size={16} /><span><strong>{calculated} priority</strong> · Rule: {item.duplicate ? 'duplicate invoice signal' : item.amount > 50000 ? 'value exceeds £50k threshold' : 'standard ageing and value rules'}</span></div><div className="detail-section"><h3>Business context</h3><dl><dt>Supplier</dt><dd>{item.supplier}</dd><dt>Company code / Plant</dt><dd>{item.companyCode} / {item.plant}</dd><dt>Storage location</dt><dd>{item.storageLocation}</dd><dt>Cost centre</dt><dd>{item.costCentre}</dd><dt>Material</dt><dd>{item.material}</dd><dt>Requested date</dt><dd>{item.requestedDate}</dd></dl></div><div className="detail-section"><h3>Process timeline</h3><div className="timeline">{item.timeline.map(([date, title, detail], index) => <div className="timeline-item" key={title}><span className={index === item.timeline.length - 1 ? 'timeline-dot current' : 'timeline-dot'} /><div><small>{date}</small><strong>{title}</strong><p>{detail}</p></div></div>)}</div></div><div className="comment-box"><div className="comment-label"><MessageSquare size={16} /> Add internal note</div><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a note for the resolution history..." /><button className="button full" onClick={() => { if (comment.trim()) { onUpdate({ timeline: [...item.timeline, ['Now', 'Note added', comment.trim()]] }); setComment(''); onNotice('Internal note added to resolution history') } }}>Save note</button></div><div className="detail-actions"><button className="button approve" onClick={() => onUpdate({ status: 'Resolved', timeline: [...item.timeline, ['Now', 'Approved and resolved', 'Resolution recorded by Priya Shah']] })}><CheckCircle2 size={16} /> Approve & resolve</button><button className="button escalate" onClick={() => onUpdate({ status: 'Escalated', risk: 'High', timeline: [...item.timeline, ['Now', 'Escalated', 'Sent to finance controller']] })}><ArrowUpRight size={16} /> Escalate</button></div></aside>
}

export default App