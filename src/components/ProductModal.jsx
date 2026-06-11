function ProductModal({ product, onClose, onAddToCart }) {
    if (!product) return null;

    const stars = Math.round(product.rating.rate);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, padding: '20px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff', borderRadius: '12px',
                    width: '90%', maxWidth: '650px', maxHeight: '90vh',
                    overflowY: 'auto', padding: '30px', position: 'relative',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
                    }}
                >×</button>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '200px', height: '200px', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <span style={{
                            display: 'inline-block', padding: '4px 10px',
                            backgroundColor: '#e9ecef', borderRadius: '20px',
                            fontSize: '12px', marginBottom: '10px', textTransform: 'capitalize',
                        }}>
                            {product.category}
                        </span>
                        <h2 style={{ margin: '0 0 12px', fontSize: '18px', lineHeight: '1.4' }}>
                            {product.title}
                        </h2>
                        <p style={{ color: '#555', lineHeight: '1.6', fontSize: '14px', marginBottom: '12px' }}>
                            {product.description}
                        </p>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', margin: '0 0 8px' }}>
                            ${product.price.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
                            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} {product.rating.rate} ({product.rating.count} ulasan)
                        </p>
                        <button
                            onClick={() => { onAddToCart(product); onClose(); }}
                            style={{
                                padding: '10px 24px', backgroundColor: '#28a745',
                                color: '#fff', border: 'none', borderRadius: '6px',
                                cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                            }}
                        >
                            🛒 Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;