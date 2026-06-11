function ProductCard({ product, onClick, onAddToCart }) {
    const stars = Math.round(product.rating.rate);

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: '#fff', borderRadius: '10px',
                padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
        >
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <img
                    src={product.image}
                    alt={product.title}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
            </div>

            <span style={{
                fontSize: '11px', color: '#888', textTransform: 'capitalize',
                marginBottom: '6px',
            }}>
                {product.category}
            </span>

            <h3 style={{
                fontSize: '14px', margin: '0 0 8px', color: '#333',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                lineHeight: '1.4', flex: 1,
            }}>
                {product.title}
            </h3>

            <p style={{ fontSize: '12px', color: '#f0a500', margin: '0 0 4px' }}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}{' '}
                <span style={{ color: '#888' }}>{product.rating.rate} ({product.rating.count})</span>
            </p>

            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', margin: '0 0 12px' }}>
                ${product.price.toFixed(2)}
            </p>

            <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                style={{
                    padding: '8px', backgroundColor: '#007bff', color: '#fff',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 'bold',
                }}
            >
                🛒 Tambah ke Keranjang
            </button>
        </div>
    );
}

export default ProductCard;