import { QRCodeCanvas } from 'qrcode.react'

export default function QRCodes() {
  const tables = Array.from({ length: 10 }, (_, i) => i + 1)
  // Hardcoded Netlify URL
  const baseUrl = "https://dineflowres.netlify.app"

  const printQRCodes = () => {
    window.print()
  }

  return (
    <div className="min-h-full bg-[#FAFAFA] p-8">
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Table QR Codes</h1>
          <p className="text-gray-500">Print these codes and place them on the tables.</p>
        </div>
        <button 
          onClick={printQRCodes}
          className="bg-charcoal text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-sm print:hidden"
        >
          Print Codes
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {tables.map(table => {
          const tableUrl = `${baseUrl}/?table=${table}`
          
          return (
            <div key={table} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <h2 className="text-xl font-bold text-charcoal mb-4">Table {table}</h2>
              <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm mb-4">
                <QRCodeCanvas 
                  value={tableUrl} 
                  size={160}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#1A1A1A"
                />
              </div>
              <p className="text-xs text-gray-400 break-all">{tableUrl}</p>
              <div className="mt-4 px-4 py-1.5 bg-gold/10 text-gold rounded-full text-xs font-bold w-full">
                Scan to Order
              </div>
            </div>
          )
        })}
      </div>

      {/* Print Styles included inline for simplicity */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .min-h-full, .min-h-full * {
            visibility: visible;
          }
          .min-h-full {
            position: absolute;
            left: 0;
            top: 0;
            background: white !important;
            padding: 0;
          }
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 2rem !important;
          }
          .bg-white {
            box-shadow: none !important;
            border: 2px solid #000 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
