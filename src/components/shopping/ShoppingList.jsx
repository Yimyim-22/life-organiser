import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import './ShoppingList.css';

const CURRENCIES = ['₦', '$', '€'];

function ShoppingList() {
    const {
        shoppingList,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        markItemPurchased,
        shoppingBudget,
        updateGeneralBudget,
        shoppingRecommendations,
        moveRecommendationToActive,
        deleteRecommendation
    } = useData();

    // Local state for the "Add Item" form
    const [newItem, setNewItem] = useState({
        name: '',
        note: '',
        cost: '',
        currency: '₦',
        frequency: 'One-time', // or 'Frequent'
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Initial sync of form currency with budget currency for convenience
    useEffect(() => {
        if (newItem.currency !== shoppingBudget?.currency) {
            setNewItem(prev => ({ ...prev, currency: shoppingBudget?.currency || '₦' }));
        }
    }, [shoppingBudget?.currency]);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.cost) return;

        addShoppingItem({
            ...newItem,
            cost: parseFloat(newItem.cost),
        });

        // Reset form but keep currency and frequency preference?
        setNewItem({
            name: '',
            note: '',
            cost: '',
            currency: newItem.currency,
            frequency: 'One-time'
        });
    };

    const handleBudgetChange = (amount) => {
        updateGeneralBudget(amount, shoppingBudget.currency);
    };

    const handleBudgetCurrencyChange = (currency) => {
        updateGeneralBudget(shoppingBudget.amount, currency);
    };

    // Calculations
    const totalSpentPerCurrency = shoppingList.reduce((acc, item) => {
        const curr = item.currency;
        acc[curr] = (acc[curr] || 0) + (parseFloat(item.cost) || 0);
        return acc;
    }, {});

    const mainCurrencyTotal = totalSpentPerCurrency[shoppingBudget.currency] || 0;
    const isOverBudget = shoppingBudget.amount > 0 && mainCurrencyTotal > shoppingBudget.amount;
    const remainingBudget = shoppingBudget.amount - mainCurrencyTotal;

    // Filter recommendations to exclude items already in the active list
    const visibleRecommendations = shoppingRecommendations.filter(rec =>
        !shoppingList.some(active => active.name.toLowerCase() === rec.name.toLowerCase())
    );

    return (
        <div className="shopping-container">
            <header className="shopping-header">
                <h1>Smart Shopping</h1>
                <p className="subtitle">Plan, track, and manage your purchases.</p>
            </header>

            {/* General Budget Card */}
            <div className="budget-card">
                <div className="budget-info">
                    <h2>Total Budget ({shoppingBudget.currency})</h2>
                    <div className="budget-display">
                        {shoppingBudget.currency}{mainCurrencyTotal.toLocaleString()}
                        <span style={{ fontSize: '0.5em', opacity: 0.7 }}> / {shoppingBudget.amount.toLocaleString()}</span>
                    </div>
                    {isOverBudget && (
                        <div className="budget-warning">
                            ⚠️ Exceeds budget by {shoppingBudget.currency}{(mainCurrencyTotal - shoppingBudget.amount).toLocaleString()}
                        </div>
                    )}
                    {!isOverBudget && shoppingBudget.amount > 0 && (
                        <div style={{ color: '#a8ffc9', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            ✅ {shoppingBudget.currency}{remainingBudget.toLocaleString()} remaining
                        </div>
                    )}
                </div>

                <div className="budget-controls">
                    <select
                        className="currency-select"
                        value={shoppingBudget.currency}
                        onChange={(e) => handleBudgetCurrencyChange(e.target.value)}
                    >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        type="number"
                        className="budget-input"
                        placeholder="Limit"
                        value={shoppingBudget.amount || ''}
                        onChange={(e) => handleBudgetChange(parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            {/* Other Currencies Summary (if any) */}
            {Object.entries(totalSpentPerCurrency).map(([curr, total]) => {
                if (curr === shoppingBudget.currency) return null;
                return (
                    <div key={curr} style={{ marginBottom: '1rem', color: '#718096', fontWeight: 500 }}>
                        Also spending: {curr}{total.toLocaleString()}
                    </div>
                );
            })}

            <div className="shopping-content">
                <div className="main-section">
                    <div className="section-title">
                        <span>🛒 Your List</span>
                    </div>

                    {/* Add Item Form */}
                    <form className="add-item-form" onSubmit={handleAddItem}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Item Name (e.g., Milk)"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <div style={{ display: 'flex', gap: '0' }}>
                                <select
                                    style={{ width: '60px', borderRadius: '8px 0 0 8px', borderRight: 'none', flexShrink: 0 }}
                                    value={newItem.currency}
                                    onChange={e => setNewItem({ ...newItem, currency: e.target.value })}
                                >
                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input
                                    style={{ borderRadius: '0 8px 8px 0', flex: 1, minWidth: 0 }}
                                    type="number"
                                    placeholder="Budget"
                                    value={newItem.cost}
                                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group form-full">
                            <input
                                type="text"
                                placeholder="Notes (optional)"
                                value={newItem.note}
                                onChange={e => setNewItem({ ...newItem, note: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <select
                                value={newItem.frequency}
                                onChange={e => setNewItem({ ...newItem, frequency: e.target.value })}
                            >
                                <option value="One-time">One-time Purchase</option>
                                <option value="Frequent">Frequent Item</option>
                            </select>
                        </div>
                        <button type="submit" className="add-btn">Add to List</button>
                    </form>

                    {/* Active List */}
                    <div className="shopping-list">
                        {shoppingList.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem' }}>
                                Your list is empty. Start planning!
                            </div>
                        )}
                        {shoppingList.map(item => {
                            const itemIsOverBudget = shoppingBudget.currency === item.currency &&
                                shoppingBudget.amount > 0 &&
                                item.cost > shoppingBudget.amount; // Simple check: item > total budget? 
                            // Use case: warn if single item eats whole budget.

                            return (
                                <div key={item.id} className={`shopping-item ${item.frequency === 'Frequent' ? 'frequent' : 'one-time'} ${itemIsOverBudget ? 'over-budget' : ''}`}>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <div className="item-meta">
                                            <span className="item-cost">{item.currency}{parseFloat(item.cost).toLocaleString()}</span>
                                            {item.note && <span>• {item.note}</span>}
                                            <span className={`badge ${item.frequency === 'Frequent' ? 'badge-frequent' : 'badge-one-time'}`}>
                                                {item.frequency}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="action-btn btn-purchase"
                                            onClick={() => markItemPurchased(item.id)}
                                            title="Mark as Purchased"
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            className="action-btn btn-delete"
                                            onClick={() => deleteShoppingItem(item.id)}
                                            title="Remove"
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommendations Panel */}
                <div className="recommendations-sidebar">
                    <div className="recommendations-panel">
                        <div className="section-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            <span>💡 Recommended</span>
                        </div>
                        <div className="rec-list">
                            {visibleRecommendations.length === 0 && (
                                <div style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
                                    Frequently purchased items will appear here.
                                </div>
                            )}
                            {visibleRecommendations.map(rec => (
                                <div key={rec.id} className="rec-item">
                                    <div className="rec-info">
                                        <h4>{rec.name}</h4>
                                        <span className="rec-price">{rec.currency}{rec.cost}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn-add-rec"
                                            onClick={() => moveRecommendationToActive(rec.id)}
                                            title="Add back to list"
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn-add-rec"
                                            onClick={() => deleteRecommendation(rec.id)}
                                            title="Forget"
                                            style={{ color: '#cbd5e0' }}
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;
