import { Room, RoomPackage } from '../types/refugium';
import { AVAILABLE_PACKAGES } from '../data/rooms';

const STORAGE_KEY = 'refugium_installed_packages';

class PackageService {
  private installedPackages: RoomPackage[] = [];

  constructor() {
    this.loadInstalledPackages();
  }

  private loadInstalledPackages(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.installedPackages = JSON.parse(data);
      }
    } catch (err) {
      console.warn('Failed to load installed packages from localStorage', err);
    }
  }

  private saveInstalledPackages(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.installedPackages));
    } catch (err) {
      console.warn('Failed to save installed packages to localStorage', err);
    }
  }

  public getInstalledRooms(): Room[] {
    return this.installedPackages.map((pkg) => pkg.roomData);
  }

  public getAvailablePackages(): RoomPackage[] {
    const installedIds = new Set(this.installedPackages.map((pkg) => pkg.id));
    return AVAILABLE_PACKAGES.filter((pkg) => !installedIds.has(pkg.id));
  }

  public isPackageInstalled(packageId: string): boolean {
    return this.installedPackages.some((pkg) => pkg.id === packageId);
  }

  /**
   * Lädt ein Raum-Paket im Hintergrund herunter und speichert es lokal.
   * Sendet zudem einen Befehl an den Service Worker, um zugehörige Assets in den CacheStorage zu legen.
   */
  public async downloadPackage(pkg: RoomPackage, onProgress?: (percent: number) => void): Promise<void> {
    if (this.isPackageInstalled(pkg.id)) return;

    // Simuliere sanften, unaufdringlichen Hintergrund-Download in Etappen
    for (let i = 1; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (onProgress) onProgress(i * 10);
    }

    // Weise Service Worker an, die Assets zu cachen
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ROOM_PACKAGE',
        packageId: pkg.id,
        assets: pkg.assets
      });
    }

    this.installedPackages.push(pkg);
    this.saveInstalledPackages();
  }

  public uninstallPackage(packageId: string): void {
    this.installedPackages = this.installedPackages.filter((pkg) => pkg.id !== packageId);
    this.saveInstalledPackages();
  }
}

export const packageService = new PackageService();