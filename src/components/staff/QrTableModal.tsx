import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, ExternalLink, Copy, Check } from 'lucide-react'
import { FoodLogo } from '../common/FoodLogo'

interface QrTableModalProps {
  isOpen: boolean
  onClose: () => void
}

const SAMPLE_TABLES = ['07', '08', '01', '02', '03', '05', '09', '12']

export const QrTableModal: React.FC<QrTableModalProps> = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState('07')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  const menuUrl = `${origin}/menu?table=${selectedTable}`

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Table QR Codes"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#1E1B18]/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl border border-[#DFD6C8] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3">
          <div className="flex items-center gap-2.5">
            <FoodLogo size="sm" />
            <div>
              <h2 className="font-serif text-base font-bold text-[#1E1B18]">
                XYZ Restaurant &bull; Table QR
              </h2>
              <p className="text-[11px] text-[#7A6756]">
                Instant table-side digital ordering without app download
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7662] hover:text-[#1E1B18] hover:bg-[#FAF7F2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Pills */}
        <div>
          <label className="block text-xs font-semibold text-[#4A3D34] mb-2">
            Select Table to Generate QR:
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SAMPLE_TABLES.map(table => (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedTable === table
                    ? 'bg-[#8E2818] text-white border-[#8E2818] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#4A3D34] border-[#E0D7C9]'
                }`}
              >
                Table {table}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E5DCD0] flex flex-col items-center justify-center space-y-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8DFC8]">
            <QRCodeSVG
              value={menuUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#1E1B18"
            />
          </div>

          <div className="text-center">
            <div className="font-serif text-base font-bold text-[#1E1B18]">
              XYZ Restaurant &bull; Table {selectedTable}
            </div>
            <div className="text-xs text-[#8C7662] mt-0.5">
              Scan with mobile phone camera to open food menu
            </div>
          </div>
        </div>

        {/* URL Box & Copy */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#4A3D34]">Menu Link for Demonstration:</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={menuUrl}
              className="flex-1 text-xs px-3 py-2 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-[#3D3128] font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-[#DDD3C4] hover:bg-[#FAF7F2] text-[#1E1B18] transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7A6756]" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <a
              href={menuUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#8E2818] hover:bg-[#782012] text-white transition cursor-pointer shadow-2xs shrink-0"
              title="Open table link in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
