export const initialExceptions = [
  {
    id: 'SRV-460034',
    supplier: 'Cobalt Engineering',
    companyCode: '1400',
    plant: '1107',
    storageLocation: 'SL16',
    costCentre: 'CC-2234',
    material: 'Smart Meter SM-8',
    amount: 59250,
    requestedDate: '2026-10-19',
    created: '2026-10-12',
    status: 'Awaiting Approval',
    risk: 'High',
    owner: 'Priya Shah',
    reason: 'Price variance against approved service order',
    duplicate: false,
    timeline: [
      ['12 Oct, 09:14', 'Exception created', 'Three-way match flagged a £4,250 variance'],
      ['12 Oct, 10:02', 'Assigned to Priya Shah', 'AP Operations queue'],
      ['12 Oct, 11:40', 'Approval requested', 'Finance controller review pending'],
    ],
  },
  {
    id: 'INV-883219', supplier: 'Northline Logistics', companyCode: '1400', plant: '1102', storageLocation: 'SL04', costCentre: 'CC-2201', material: 'Freight handling services', amount: 18400, requestedDate: '2026-10-16', created: '2026-10-10', status: 'In Review', risk: 'Medium', owner: 'Marcus Green', reason: 'Missing goods receipt', duplicate: false,
    timeline: [['10 Oct, 14:20', 'Exception created', 'Goods receipt could not be matched'], ['11 Oct, 08:45', 'Assigned to Marcus Green', 'AP Operations queue']],
  },
  {
    id: 'INV-882901', supplier: 'Vertex Industrial', companyCode: '2300', plant: '2301', storageLocation: 'SL08', costCentre: 'CC-3110', material: 'Conveyor belt assembly', amount: 126800, requestedDate: '2026-10-08', created: '2026-10-03', status: 'Escalated', risk: 'Critical', owner: 'Lena Ortiz', reason: 'Potential duplicate invoice', duplicate: true,
    timeline: [['03 Oct, 13:06', 'Exception created', 'Invoice number matched a prior document'], ['06 Oct, 15:30', 'Escalated', 'Supplier confirmation required']],
  },
  {
    id: 'INV-881740', supplier: 'Harbor Energy', companyCode: '1400', plant: '1107', storageLocation: 'SL16', costCentre: 'CC-2234', material: 'Grid monitoring support', amount: 7400, requestedDate: '2026-10-14', created: '2026-10-08', status: 'Awaiting Approval', risk: 'Low', owner: 'Priya Shah', reason: 'Cost centre not populated', duplicate: false,
    timeline: [['08 Oct, 09:18', 'Exception created', 'Coding validation failed'], ['09 Oct, 10:24', 'Approval requested', 'Waiting for cost owner']],
  },
  {
    id: 'INV-880421', supplier: 'Cobalt Engineering', companyCode: '2300', plant: '2305', storageLocation: 'SL02', costCentre: 'CC-3114', material: 'Telemetry gateway', amount: 32100, requestedDate: '2026-10-03', created: '2026-09-28', status: 'Resolved', risk: 'Medium', owner: 'Lena Ortiz', reason: 'Tax code mismatch', duplicate: false,
    timeline: [['28 Sep, 11:12', 'Exception created', 'Tax code did not match plant rules'], ['02 Oct, 16:10', 'Resolved', 'Corrected by supplier and re-posted']],
  },

  {
    id: 'INV-880000', supplier: 'AAA Enterprise', companyCode: '1000', plant: '120', storageLocation: 'SL26', costCentre: 'CC-2534', material: 'Tele Grid', amount: 8000, requestedDate: '2026-10-10', created: '2026-10-07', status: 'Awaiting Approval', risk: 'Low', owner: 'Ram', reason: 'Cost centre not populated', duplicate: false,
    timeline: [['07 Oct, 09:18', 'Exception created', 'Coding validation failed'], ['10 Oct, 10:24', 'Approval requested', 'Waiting for cost owner']],
  },
]

export const formatCurrency = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)