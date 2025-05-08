const { useState, useEffect } = React;

function CartelBaron() {
    // État du jeu
    const [money, setMoney] = useState(1000);
    const [drugs, setDrugs] = useState(0);
    const [risk, setRisk] = useState(10);
    const [dealers, setDealers] = useState(0);
    const [enforcers, setEnforcers] = useState(0);
    const [territory, setTerritory] = useState(1);
    const [notification, setNotification] = useState("");
    
    // Prix des items
    const prices = {
        dealer: 500,
        enforcer: 1000,
        territory: 5000
    };
    
    // Types de drogue disponibles
    const drugTypes = [
        { emoji: "🍁", name: "Weed", price: 10, risk: 5 },
        { emoji: "💊", name: "Pills", price: 25, risk: 15 },
        { emoji: "❄️", name: "Coke", price: 50, risk: 25 },
        { emoji: "⚗️", name: "Meth", price: 100, risk: 40 }
    ];
    
    const [selectedDrug, setSelectedDrug] = useState(drugTypes[0]);
    
    // Effet pour la production automatique
    useEffect(() => {
        const interval = setInterval(() => {
            if (dealers > 0) {
                const production = dealers * territory;
                setDrugs(prev => prev + production);
                showNotification(`+${production} ${selectedDrug.emoji} produits par vos dealers`);
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, [dealers, territory, selectedDrug]);
    
    // Afficher une notification temporaire
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 3000);
    };
    
    // Acheter de la drogue
    const buyDrugs = () => {
        const amount = Math.floor(Math.random() * 10) + 1;
        const cost = amount * selectedDrug.price;
        
        if (money >= cost) {
            setMoney(money - cost);
            setDrugs(drugs + amount);
            showNotification(`Achat: +${amount} ${selectedDrug.emoji} pour $${cost}`);
        } else {
            showNotification("Pas assez d'argent!");
        }
    };
    
    // Vendre de la drogue
    const sellDrugs = () => {
        if (drugs > 0) {
            const amount = Math.min(Math.floor(Math.random() * 5) + 1, drugs);
            const earnings = amount * selectedDrug.price * 2;
            const bustChance = Math.random() * 100;
            
            if (bustChance < selectedDrug.risk - (enforcers * 2)) {
                // Arrestation!
                const lost = Math.floor(money * 0.3);
                setMoney(money - lost);
                setDrugs(0);
                showNotification(`🚨 ARRESTÉ! Perdu $${lost} et toute votre drogue!`);
            } else {
                // Vente réussie
                setMoney(money + earnings);
                setDrugs(drugs - amount);
                showNotification(`Vente: +$${earnings} pour ${amount} ${selectedDrug.emoji}`);
            }
        } else {
            showNotification("Pas de drogue à vendre!");
        }
    };
    
    // Regarder une pub pour gagner de l'argent
    const watchAd = () => {
        const earnings = 500 + Math.floor(Math.random() * 1000);
        setMoney(money + earnings);
        showNotification(`Pub regardée: +$${earnings}`);
        
        // Ici vous intégreriez le SDK de pub réel
        console.log("Display ad and reward player");
    };
    
    // Acheter un dealer
    const buyDealer = () => {
        if (money >= prices.dealer) {
            setMoney(money - prices.dealer);
            setDealers(dealers + 1);
            showNotification("Nouveau dealer recruté!");
        } else {
            showNotification("Pas assez d'argent!");
        }
    };
    
    // Acheter un enforcer
    const buyEnforcer = () => {
        if (money >= prices.enforcer) {
            setMoney(money - prices.enforcer);
            setEnforcers(enforcers + 1);
            showNotification("Nouveau gros bras recruté!");
        } else {
            showNotification("Pas assez d'argent!");
        }
    };
    
    // Acheter un territoire
    const buyTerritory = () => {
        if (money >= prices.territory) {
            setMoney(money - prices.territory);
            setTerritory(territory + 1);
            showNotification("Nouveau territoire acquis!");
        } else {
            showNotification("Pas assez d'argent!");
        }
    };
    
    // Changer le type de drogue
    const changeDrugType = (drug) => {
        setSelectedDrug(drug);
        showNotification(`Production changée: ${drug.emoji} ${drug.name}`);
    };

    return (
        <div className="game-container">
            <div className="header">
                <h1>🕴️ Cartel Baron</h1>
                <p>Devenez le plus grand baron de la drogue!</p>
            </div>
            
            {notification && <div className="notification">{notification}</div>}
            
            <div className="stats">
                <div>💰 ${money.toLocaleString()}</div>
                <div>{selectedDrug.emoji} {drugs.toLocaleString()}</div>
            </div>
            
            <div className="actions">
                <button onClick={buyDrugs}>Acheter {selectedDrug.emoji}</button>
                <button onClick={sellDrugs}>Vendre {selectedDrug.emoji}</button>
            </div>
            
            <div className="ad-container">
                <p>Regardez une pub pour gagner de l'argent!</p>
                <button className="ad-button" onClick={watchAd}>📺 Regarder une pub</button>
            </div>
            
            <div className="shop">
                <h3>🛒 Boutique du Cartel</h3>
                
                <div className="shop-item">
                    <div>
                        <strong>🕴️ Dealer</strong><br />
                        Produit de la drogue automatiquement
                    </div>
                    <button onClick={buyDealer}>${prices.dealer}</button>
                </div>
                
                <div className="shop-item">
                    <div>
                        <strong>💪 Gros bras</strong><br />
                        Réduit le risque d'arrestation
                    </div>
                    <button onClick={buyEnforcer}>${prices.enforcer}</button>
                </div>
                
                <div className="shop-item">
                    <div>
                        <strong>🗺️ Territoire</strong><br />
                        Augmente la production
                    </div>
                    <button onClick={buyTerritory}>${prices.territory}</button>
                </div>
            </div>
            
            <div className="drug-selection">
                <h3>🔀 Changer de produit</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {drugTypes.map(drug => (
                        <button 
                            key={drug.name}
                            onClick={() => changeDrugType(drug)}
                            disabled={selectedDrug.name === drug.name}
                            style={{ fontSize: '20px' }}
                        >
                            {drug.emoji} {drug.name}
                        </button>
                    ))}
                </div>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
                <p>Dealers: {dealers} | Gros bras: {enforcers} | Territoires: {territory}</p>
                <p>Risque actuel: {Math.max(0, selectedDrug.risk - (enforcers * 2))}%</p>
            </div>
        </div>
    );
}

ReactDOM.render(<CartelBaron />, document.getElementById('root'));
