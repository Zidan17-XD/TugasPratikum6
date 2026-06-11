function Cart({ items, onClose, onRemove, onClear }) {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'flex-end',
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff', width: '380px', maxWidth: '100%',
                    height: '100%', overflowY: 'auto', padding: '24px',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>🛒 Keranjang ({items.length})</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>
                        ×
                    </button>
                </div>

                {items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Keranjang kosong.</p>
                ) : (
                    <>
                        <div style={{ flex: 1 }}>
                            {items.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex', gap: '12px', marginBottom: '16px',
                                    paddingBottom: '16px', borderBottom: '1px solid #eee',
                                }}>
                                    <img
                                        src={item.image} alt={item.title}
                                        style={{ width: '60px', height: '60px', objectFit: 'contain', flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '13px', margin: '0 0 4px', lineHeight: '1.3' }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#007bff', margin: '0 0 6px', fontWeight: 'bold' }}>
                                            ${item.price.toFixed(2)} × {item.qty} = ${(item.price * item.qty).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            style={{
                                                fontSize: '12px', color: '#dc3545', background: 'none',
                                                border: 'none', cursor: 'pointer', padding: 0,
                                            }}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #eee', paddingTop: '16px' }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px' }}>
                                Total: ${total.toFixed(2)}
                            </p>
                            <button
                                onClick={onClear}
                                style={{
                                    width: '100%', padding: '12px', backgroundColor: '#dc3545',
                                    color: '#fff', border: 'none', borderRadius: '6px',
                                    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px',
                                }}
                            >
                                🗑️ Kosongkan Keranjang
                            </button>
                            <button
                                style={{
                                    width: '100%', padding: '12px', backgroundColor: '#28a745',
                                    color: '#fff', border: 'none', borderRadius: '6px',
                                    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                                }}
                                onClick={() => alert(`✅ Pesanan senilai $${total.toFixed(2)} berhasil dibuat! (simulasi)`)}
                            >
                                ✅ Checkout (Simulasi)
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;