import { useState } from 'react';
import { facturesService } from '../../services/factures.service';

interface Props {
  factureId: string;
  reste: number;
  onClose: () => void;
  onSuccess: () => void;
}

type Methode = 'CARD' | 'ESPECES' | 'VIREMENT' | 'CHEQUE';

// Algorithme de Luhn pour valider le numéro de carte
function luhn(num: string): boolean {
  const digits = num.replace(/\s/g, '').split('').reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    return acc + d;
  }, 0);
  return sum % 10 === 0;
}

// Détecte le type de carte
function detectCard(num: string): 'visa' | 'mastercard' | 'unknown' {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  return 'unknown';
}

// Formatte le numéro de carte
function formatCardNum(val: string): string {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

// Formatte la date d'expiration
function formatExpiry(val: string): string {
  const v = val.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
  return v;
}

export default function PaiementForm({ factureId, reste, onClose, onSuccess }: Props) {
  const [methode, setMethode] = useState<Methode>('CARD');
  const [card, setCard] = useState({ numero: '', expiry: '', cvv: '', nom: '' });
  const [montant, setMontant] = useState(reste.toString());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [flipped, setFlipped] = useState(false);

  const cardType = detectCard(card.numero);
  const cardNumClean = card.numero.replace(/\s/g, '');
  const isCardValid = cardNumClean.length === 16 && luhn(cardNumClean);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry);
  const isCvvValid = card.cvv.length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (methode === 'CARD') {
      if (!isCardValid) { setError('Numéro de carte invalide'); return; }
      if (!isExpiryValid) { setError('Date d\'expiration invalide'); return; }
      if (!isCvvValid) { setError('CVV invalide'); return; }
    }

    setLoading(true);
    try {
      await facturesService.addPaiement(factureId, {
        methode: methode === 'CARD' ? 'ONLINE' : methode,
        montantVerse: Number(montant),
        // Référence hashée (simulation)
        reference: methode === 'CARD'
          ? `CARD-${cardNumClean.slice(-4)}-${Date.now()}`
          : undefined,
      });

      setSuccess(true);
      setTimeout(() => { onSuccess(); }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#161b27] border border-green-800 rounded-xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-green-400 font-medium text-lg mb-1">Paiement accepté</h3>
          <p className="text-slate-400 text-sm">{Number(montant).toLocaleString()} MAD débité avec succès</p>
          {methode === 'CARD' && (
            <p className="text-slate-500 text-xs mt-2">Carte ••••{cardNumClean.slice(-4)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2d3348]">
          <div>
            <h2 className="text-slate-100 font-medium">Paiement sécurisé</h2>
            <p className="text-slate-500 text-xs mt-0.5">Reste à payer : <span className="text-indigo-400 font-medium">{reste.toLocaleString()} MAD</span></p>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
            <span className="text-green-400 text-[10px]">SSL</span>
            <button onClick={onClose} className="ml-3 text-slate-500 hover:text-slate-300 text-xl">×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

          {/* Méthode de paiement */}
          <div className="grid grid-cols-4 gap-2">
            {(['CARD', 'ESPECES', 'VIREMENT', 'CHEQUE'] as Methode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMethode(m)}
                className={`py-2 text-[10px] rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                  methode === m
                    ? 'bg-[#1e2a4a] text-indigo-400 border-indigo-800'
                    : 'border-[#2d3348] text-slate-500 hover:border-slate-600'
                }`}
              >
                {m === 'CARD' && '💳'}
                {m === 'ESPECES' && '💵'}
                {m === 'VIREMENT' && '🏦'}
                {m === 'CHEQUE' && '📄'}
                {m === 'CARD' ? 'Carte' : m.charAt(0) + m.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Formulaire carte */}
          {methode === 'CARD' && (
            <>
              {/* Aperçu carte */}
              <div
                className="relative h-44 rounded-xl overflow-hidden cursor-pointer select-none"
                onClick={() => setFlipped(!flipped)}
                style={{ perspective: '1000px' }}
              >
                {!flipped ? (
                  /* Face avant */
                  <div className={`absolute inset-0 rounded-xl p-5 flex flex-col justify-between
                    ${cardType === 'visa' ? 'bg-gradient-to-br from-blue-900 to-blue-700' :
                      cardType === 'mastercard' ? 'bg-gradient-to-br from-red-900 to-orange-700' :
                      'bg-gradient-to-br from-slate-800 to-slate-700'}`}>
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-7 bg-yellow-400/80 rounded-sm" />
                      <span className="text-white/80 text-sm font-bold tracking-wider">
                        {cardType === 'visa' ? 'VISA' : cardType === 'mastercard' ? 'MC' : ''}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/90 text-lg font-mono tracking-widest mb-3">
                        {card.numero || '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-white/50 text-[9px] uppercase">Titulaire</p>
                          <p className="text-white/90 text-[12px] font-medium uppercase">
                            {card.nom || 'NOM PRENOM'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-[9px] uppercase">Expire</p>
                          <p className="text-white/90 text-[12px] font-medium">
                            {card.expiry || 'MM/AA'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Face arrière */
                  <div className={`absolute inset-0 rounded-xl
                    ${cardType === 'visa' ? 'bg-gradient-to-br from-blue-900 to-blue-700' :
                      cardType === 'mastercard' ? 'bg-gradient-to-br from-red-900 to-orange-700' :
                      'bg-gradient-to-br from-slate-800 to-slate-700'}`}>
                    <div className="h-10 bg-black/40 mt-6" />
                    <div className="flex items-center gap-3 px-5 mt-4">
                      <div className="flex-1 h-8 bg-white/20 rounded" />
                      <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-slate-800 text-sm font-bold">{card.cvv || 'CVV'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-[10px] text-center -mt-2">Cliquer sur la carte pour voir le CVV</p>

              {/* Champs carte */}
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Numéro de carte</label>
                <div className="relative">
                  <input
                    value={card.numero}
                    onChange={e => setCard({ ...card, numero: formatCardNum(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none transition-colors
                      ${card.numero && !isCardValid ? 'border-red-700' : card.numero && isCardValid ? 'border-green-700' : 'border-[#2d3348] focus:border-indigo-500'}`}
                  />
                  {card.numero && (
                    <span className="absolute right-3 top-2.5 text-[11px]">
                      {isCardValid ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs mb-1 block">Nom sur la carte</label>
                <input
                  value={card.nom}
                  onChange={e => setCard({ ...card, nom: e.target.value.toUpperCase() })}
                  placeholder="MAROUANE MOUMEN"
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Date d'expiration</label>
                  <input
                    value={card.expiry}
                    onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={`w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none transition-colors
                      ${card.expiry && !isExpiryValid ? 'border-red-700' : card.expiry && isExpiryValid ? 'border-green-700' : 'border-[#2d3348] focus:border-indigo-500'}`}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">CVV</label>
                  <input
                    value={card.cvv}
                    onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="•••"
                    type="password"
                    maxLength={4}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Logos Visa / Mastercard */}
              <div className="flex gap-2 items-center">
                <span className="text-slate-600 text-[10px]">Accepté :</span>
                <div className="bg-blue-900/30 border border-blue-900/50 px-2 py-0.5 rounded text-[10px] text-blue-400 font-bold">VISA</div>
                <div className="bg-red-900/30 border border-red-900/50 px-2 py-0.5 rounded text-[10px] text-red-400 font-bold">Mastercard</div>
              </div>
            </>
          )}

          {/* Montant */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Montant à payer (MAD)</label>
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              max={reste}
              min={1}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Traitement...
                </span>
              ) : `Payer ${Number(montant).toLocaleString()} MAD`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}