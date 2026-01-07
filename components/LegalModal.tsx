import React, { useState } from 'react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'conduct' | 'whistle'>('conduct');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gray-800 text-white p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <span>⚖️</span> Conformité & Sécurité
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Département des Affaires Internes de la Sauce</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
                        aria-label="Fermer"
                    >
                        &times;
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 shrink-0">
                    <button 
                        onClick={() => setActiveTab('conduct')}
                        className={`flex-1 py-4 px-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors ${activeTab === 'conduct' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Code de Conduite
                    </button>
                    <button 
                        onClick={() => setActiveTab('whistle')}
                        className={`flex-1 py-4 px-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors ${activeTab === 'whistle' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Lanceur d'Alerte
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto">
                    {activeTab === 'conduct' ? (
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">1. Respect de la Marmite</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    La Sauce est une entité vivante et sacrée. Tout participant s'engage solennellement à ne pas gaspiller de nourriture virtuelle. Si le Chef tombe, c'est un drame culinaire, pas un spectacle de divertissement.
                                </p>
                            </section>
                            
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">2. Intégrité du Quiz (Fair-Play)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    L'utilisation de moteurs de recherche, d'encyclopédies, de l'appel à un ami ou de l'intelligence artificielle pour trouver les réponses est strictement interdite. Le Chef saura si vous trichez (il possède un sixième sens développé par les vapeurs de piment).
                                </p>
                            </section>
                            
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">3. Bienveillance envers le Personnel</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Il est formellement interdit de rire de manière diabolique lorsque le Chef commence à transpirer (emoji 😰). Un peu de compassion est requise, même si ses cris sont silencieux.
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Politique de Signalement (Whistleblowing)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Le programme <span className="italic">"Siffleur de Marmite"</span> permet à tout joueur de signaler anonymement des abus graves ou des dangers imminents dans la cuisine.
                                </p>
                            </section>

                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <h4 className="font-bold text-red-700 text-sm mb-2">🚨 Incidents à signaler immédiatement :</h4>
                                <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                                    <li>Question suggérant que la pizza à l'ananas est une spécialité italienne (Hérésie).</li>
                                    <li>Sauce jugée trop liquide ou manquant de sel.</li>
                                    <li>Chef qui ne tombe pas alors que la réponse était clairement fausse (Bug de gravité).</li>
                                </ul>
                            </div>

                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Protection des Délateurs</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Votre anonymat est garanti par la Guilde des Assassins Culinaires. Aucune représaille ne sera tolérée, et le Chef ne viendra pas hanter votre propre cuisine... en principe.
                                </p>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 text-center shrink-0">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all active:scale-95 shadow-lg text-sm"
                    >
                        J'accepte ces conditions (et le risque)
                    </button>
                </div>
            </div>
        </div>
    );
};