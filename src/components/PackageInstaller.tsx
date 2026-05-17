import React, { useState, useEffect } from 'react';
import { RoomPackage } from '../types/refugium';
import { packageService } from '../services/packageService';
import { Download, Check, Trash2, X, RefreshCw } from 'lucide-react';

interface PackageInstallerProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageInstalled: () => void;
}

export const PackageInstaller: React.FC<PackageInstallerProps> = ({
  isOpen,
  onClose,
  onPackageInstalled
}) => {
  const [availablePackages, setAvailablePackages] = useState<RoomPackage[]>([]);
  const [installedRooms, setInstalledRooms] = useState<RoomPackage[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const refreshPackages = () => {
    setAvailablePackages(packageService.getAvailablePackages());
    try {
      const data = localStorage.getItem('refugium_installed_packages');
      if (data) {
        setInstalledRooms(JSON.parse(data));
      } else {
        setInstalledRooms([]);
      }
    } catch {
      setInstalledRooms([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshPackages();
    }
  }, [isOpen]);

  const handleDownload = async (pkg: RoomPackage) => {
    if (downloadingId) return;

    setDownloadingId(pkg.id);
    setDownloadProgress(0);

    await packageService.downloadPackage(pkg, (progress) => {
      setDownloadProgress(progress);
    });

    setDownloadingId(null);
    setDownloadProgress(0);
    refreshPackages();
    onPackageInstalled();
  };

  const handleUninstall = (packageId: string) => {
    packageService.uninstallPackage(packageId);
    refreshPackages();
    onPackageInstalled();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none font-sans">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-gray-200 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
          title="Schließen"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="text-xs tracking-[0.3em] text-gray-400 uppercase font-light">
            Erweiterungs-Mechanismus
          </span>
          <h2 className="text-2xl font-light tracking-wide text-gray-100 font-cinzel mt-1">
            Optionale Raum-Pakete
          </h2>
          <p className="text-sm text-gray-400 font-light mt-2 leading-relaxed font-spectral italic">
            Hier können zusätzliche atmosphärische Orte bei bestehender Internetverbindung im Hintergrund geladen und lokal gecacht werden. In der finalen Version geschieht dies unbemerkt im Hintergrund.
          </p>
        </div>

        {/* Verfügbare Pakete zum Download */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Verfügbare Orte ({availablePackages.length})
          </h3>
          {availablePackages.length === 0 ? (
            <p className="text-sm text-gray-500 italic font-light">Keine neuen Raum-Pakete verfügbar.</p>
          ) : (
            availablePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl gap-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="text-base font-medium text-gray-200 font-cinzel">{pkg.name}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-sans">
                      v{pkg.version}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">{pkg.sizeKb} KB</span>
                  </div>
                  <p className="text-xs text-gray-400 font-light mt-1 font-spectral italic">
                    {pkg.description}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  {downloadingId === pkg.id ? (
                    <div className="flex items-center space-x-3">
                      <RefreshCw size={16} className="animate-spin text-amber-400" />
                      <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-sans">{downloadProgress}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(pkg)}
                      className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 rounded-full text-xs tracking-wider transition-all"
                    >
                      <Download size={14} />
                      <span className="font-sans uppercase text-[11px]">Laden & Cachen</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Installierte Pakete */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Lokal gecachte Orte ({installedRooms.length})
          </h3>
          {installedRooms.length === 0 ? (
            <p className="text-sm text-gray-500 italic font-light">Noch keine zusätzlichen Orte installiert.</p>
          ) : (
            installedRooms.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800/50 rounded-2xl"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Check size={16} className="text-emerald-400" />
                    <h4 className="text-base font-medium text-gray-200 font-cinzel">{pkg.name}</h4>
                    <span className="text-[10px] text-slate-400 font-sans">Offline verfügbar</span>
                  </div>
                  <p className="text-xs text-gray-500 font-light mt-0.5 font-spectral italic">
                    Integrierter Klickbereich in bestehenden Räumen aktiviert.
                  </p>
                </div>

                <button
                  onClick={() => handleUninstall(pkg.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Paket entfernen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-full text-xs tracking-wider uppercase transition-colors font-sans"
          >
            Zurück zur Zuflucht
          </button>
        </div>
      </div>
    </div>
  );
};