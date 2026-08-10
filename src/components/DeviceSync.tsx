import React, { useState } from 'react';
import { Bluetooth, Glasses, Watch, CircleDot, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

/**
 * Honest device-sync panel.
 *
 * Two of the four connections below use REAL browser hardware APIs and will
 * actually pair with real devices over Bluetooth/WebXR — nothing here is a
 * mockup:
 *   - Smartwatch / Smart Ring (Bluetooth LE heart-rate band): uses the
 *     standard Web Bluetooth API (navigator.bluetooth) and the standard BLE
 *     "Heart Rate" GATT service (0x180D) that most fitness wearables expose.
 *     Requires Chrome/Edge on desktop or Android, served over HTTPS.
 *   - VR headset: uses the real WebXR Device API (navigator.xr) to detect
 *     and enter an immersive session if a headset is plugged in / paired.
 *
 * Smart glasses and proprietary smart-ring apps (e.g. Oura) do not expose a
 * public browser API — those require a native mobile app and the vendor's
 * own SDK, which is a real Phase 2 build, not something fakeable here. They
 * are shown as "Coming soon" rather than pretending to connect.
 */

type ConnStatus = 'idle' | 'connecting' | 'connected' | 'unsupported' | 'error';

export default function DeviceSync() {
  const { currentUser, userProfile } = useAppContext();
  const { t } = useLanguage();
  const [btStatus, setBtStatus] = useState<ConnStatus>('idle');
  const [btDeviceName, setBtDeviceName] = useState<string>('');
  const [btHeartRate, setBtHeartRate] = useState<number | null>(null);
  const [xrStatus, setXrStatus] = useState<ConnStatus>('idle');
  const [error, setError] = useState('');

  const logDeviceData = async (source: string, payload: Record<string, any>) => {
    if (!currentUser || !userProfile?.id) return;
    try {
      await addDoc(collection(db, 'deviceData'), {
        userId: userProfile.id,
        source,
        payload,
        recordedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Failed to log device data', e);
    }
  };

  const connectBluetoothHeartRate = async () => {
    setError('');
    if (!('bluetooth' in navigator)) {
      setBtStatus('unsupported');
      setError('Web Bluetooth is not available in this browser. Try Chrome or Edge on desktop or Android, over HTTPS.');
      return;
    }
    try {
      setBtStatus('connecting');
      // @ts-ignore - navigator.bluetooth is not in default TS lib until dom.bluetooth is added
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
      });
      setBtDeviceName(device.name || 'Paired device');
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        // Standard BLE heart-rate measurement parsing (flags byte + uint8/uint16 bpm)
        const flags = value.getUint8(0);
        const rate16 = (flags & 0x1) !== 0;
        const bpm = rate16 ? value.getUint16(1, true) : value.getUint8(1);
        setBtHeartRate(bpm);
        logDeviceData('bluetooth_heart_rate', { bpm, deviceName: device.name });
      });
      setBtStatus('connected');
    } catch (e: any) {
      console.error(e);
      setBtStatus('error');
      setError(e?.message || 'Could not connect to a Bluetooth device.');
    }
  };

  const enterVR = async () => {
    setError('');
    // @ts-ignore - navigator.xr is not in default TS lib without the webxr types package
    if (!('xr' in navigator)) {
      setXrStatus('unsupported');
      setError('WebXR is not available in this browser/device. A VR headset with a WebXR-capable browser (e.g. Meta Quest Browser) is required.');
      return;
    }
    try {
      setXrStatus('connecting');
      // @ts-ignore
      const supported = await navigator.xr.isSessionSupported('immersive-vr');
      if (!supported) {
        setXrStatus('unsupported');
        setError('No VR headset detected on this device.');
        return;
      }
      // @ts-ignore
      const session = await navigator.xr.requestSession('immersive-vr');
      setXrStatus('connected');
      logDeviceData('vr_session', { startedAt: new Date().toISOString() });
      session.addEventListener('end', () => setXrStatus('idle'));
    } catch (e: any) {
      console.error(e);
      setXrStatus('error');
      setError(e?.message || 'Could not start a VR session.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-2xl">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <Bluetooth className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-900">{t('deviceSync')}</h3>
          <p className="text-neutral-500 text-sm">Connect real wearables and VR hardware to this account.</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {/* Bluetooth smartwatch / smart ring — real Web Bluetooth pairing */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Watch className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="font-semibold text-neutral-800">Smartwatch / Smart Ring (Bluetooth)</p>
              <p className="text-xs text-neutral-500">
                {btStatus === 'connected'
                  ? `Connected: ${btDeviceName}${btHeartRate ? ` — ${btHeartRate} bpm` : ''}`
                  : 'Pairs with any BLE device broadcasting a standard Heart Rate service.'}
              </p>
            </div>
          </div>
          {btStatus === 'connected' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <button
              onClick={connectBluetoothHeartRate}
              disabled={btStatus === 'connecting'}
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
            >
              {btStatus === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>

        {/* VR headset — real WebXR entry point */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CircleDot className="w-5 h-5 text-neutral-500" />
            <div>
              <p className="font-semibold text-neutral-800">VR Headset (WebXR)</p>
              <p className="text-xs text-neutral-500">
                {xrStatus === 'connected' ? 'VR session active.' : 'Launches an immersive session on a connected headset.'}
              </p>
            </div>
          </div>
          {xrStatus === 'connected' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <button
              onClick={enterVR}
              disabled={xrStatus === 'connecting'}
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
            >
              {xrStatus === 'connecting' ? 'Connecting...' : 'Enter VR'}
            </button>
          )}
        </div>

        {/* Honest roadmap items — no public web API exists for these yet */}
        <div className="flex items-center justify-between p-4 border border-dashed border-neutral-200 rounded-xl opacity-60">
          <div className="flex items-center gap-3">
            <Glasses className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="font-semibold text-neutral-600">Smart Glasses</p>
              <p className="text-xs text-neutral-400">Requires a native companion app and vendor SDK — Phase 2 roadmap.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase">Coming soon</span>
        </div>

        <div className="flex items-center justify-between p-4 border border-dashed border-neutral-200 rounded-xl opacity-60">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="font-semibold text-neutral-600">Wi-Fi Sync</p>
              <p className="text-xs text-neutral-400">Already on — this app syncs live over your network via Firebase whenever you're online.</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-neutral-300" />
        </div>
      </div>
    </div>
  );
}
