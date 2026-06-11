import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import Cart from './Cart';

const BASE_URL = 'https://fakestoreapi.com';
const ITEMS_PER_PAGE = 8;

// ── Keyframe CSS ──────────────────────────────────────────
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (max-width: 600px)  { .product-grid { grid-template-columns: 1fr !important; } }
`;
document.head.appendChild(styleTag);

function ProductCatalog() {
    // ─── STATE ──────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [minRating, setMinRating] = useState(0);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [toast, setToast] = useState(null);

    // ─── useEFFECT: Fetch produk & kategori ─────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/products`),
                    axios.get(`${BASE_URL}/products/categories`),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                setError(err.message || 'Gagal mengambil data produk.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ─── useEFFECT: Fetch by kategori ───────────────────────
    useEffect(() => {
        if (selectedCategory === 'all') return;

        const fetchByCategory = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BASE_URL}/products/category/${selectedCategory}`);
                setProducts(res.data);
                setCurrentPage(1);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchByCategory();
    }, [selectedCategory]);

    // ─── useEFFECT: Reset ke semua produk saat kategori 'all' ─
    useEffect(() => {
        if (selectedCategory !== 'all') return;
        const refetch = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BASE_URL}/products`);
                setProducts(res.data);
                setCurrentPage(1);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        refetch();
    }, [selectedCategory]);

    // ─── TOAST ──────────────────────────────────────────────
    const showToast = useCallback((message) => {
        setToast(message);
        setTimeout(() => setToast(null), 2500);
    }, []);

    // ─── CART ────────────────────────────────────────────────
    const addToCart = useCallback((product) => {
        setCartItems((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists) {
                showToast(`🔄 Jumlah "${product.title.slice(0, 30)}..." ditambah`);
                return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            showToast(`✅ "${product.title.slice(0, 30)}..." ditambahkan ke keranjang`);
            return [...prev, { ...product, qty: 1 }];
        });
    }, [showToast]);

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        if (window.confirm('Kosongkan keranjang?')) setCartItems([]);
    };

    // ─── FILTER + SORT ───────────────────────────────────────
    const getFilteredProducts = () => {
        let result = [...products];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) => p.title.toLowerCase().includes(q));
        }

        if (minRating > 0) {
            result = result.filter((p) => p.rating.rate >= minRating);
        }

        const min = parseFloat(priceRange.min);
        const max = parseFloat(priceRange.max);
        if (!isNaN(min)) result = result.filter((p) => p.price >= min);
        if (!isNaN(max)) result = result.filter((p) => p.price <= max);

        if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result.sort((a, b) => b.rating.rate - a.rating.rate);
        if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title));

        return result;
    };

    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalCartQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

    // ─── CONDITIONAL RENDERING: LOADING ─────────────────────
    if (loading && products.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ width: '48px', height: '48px', border: '5px solid #f0f0f0', borderTop: '5px solid #007bff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' }} />
                <p style={{ color: '#555' }}>Memuat produk...</p>
            </div>
        );
    }

    // ─── CONDITIONAL RENDERING: ERROR ───────────────────────
    if (error && products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'Arial, sans-serif' }}>
                <p style={{ fontSize: '48px' }}>⚠️</p>
                <h2 style={{ color: '#dc3545' }}>Gagal memuat data</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '10px 24px', backgroundColor: '#007bff', color: '#DAA520', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                >
                    🔄 Coba Lagi
                </button>
            </div>
        );
    }

    // ─── RENDER ──────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFAF0', fontFamily: 'Arial, sans-serif' }}>

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
                    backgroundColor: '#28a745', color: '#fff', padding: '12px 20px',
                    borderRadius: '8px', fontSize: '14px', animation: 'fadeIn 0.3s ease',
                    maxWidth: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                    {toast}
                </div>
            )}

            {/* NAVBAR */}
            <div style={{
                backgroundColor: '#fff', padding: '14px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <h1 style={{ margin: 0, fontSize: '22px', color: '#6B8E23' }}>🛍️ Product Mall</h1>
                <button
                    onClick={() => setShowCart(true)}
                    style={{
                        padding: '8px 18px', backgroundColor: '#007bff', color: '#fff',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '14px', fontWeight: 'bold', position: 'relative',
                    }}
                >
                    🛒 Keranjang {totalCartQty > 0 && (
                        <span style={{
                            backgroundColor: '#dc3545', color: '#fff', borderRadius: '50%',
                            padding: '1px 6px', fontSize: '11px', marginLeft: '6px',
                        }}>
                            {totalCartQty}
                        </span>
                    )}
                </button>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>

                {/* FILTER & SEARCH BAR */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '10px',
                    padding: '20px', marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end',
                }}>

                    {/* Search */}
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Cari Produk</label>
                        <input
                            type="text"
                            placeholder="🔍 Cari nama produk..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Kategori */}
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Kategori</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Urutkan</label>
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        >
                            <option value="default">Default</option>
                            <option value="price-asc">Harga: Termurah</option>
                            <option value="price-desc">Harga: Termahal</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="name">Nama A-Z</option>
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div style={{ flex: '1 1 140px' }}>
                        <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Min. Rating</label>
                        <select
                            value={minRating}
                            onChange={(e) => { setMinRating(parseFloat(e.target.value)); setCurrentPage(1); }}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        >
                            <option value={0}>Semua Rating</option>
                            <option value={3}>⭐ 3+</option>
                            <option value={3.5}>⭐ 3.5+</option>
                            <option value={4}>⭐ 4+</option>
                            <option value={4.5}>⭐ 4.5+</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Rentang Harga ($)</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                                type="number" placeholder="Min" value={priceRange.min}
                                onChange={(e) => { setPriceRange((p) => ({ ...p, min: e.target.value })); setCurrentPage(1); }}
                                style={{ width: '50%', padding: '9px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                            <input
                                type="number" placeholder="Max" value={priceRange.max}
                                onChange={(e) => { setPriceRange((p) => ({ ...p, max: e.target.value })); setCurrentPage(1); }}
                                style={{ width: '50%', padding: '9px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={() => {
                            setSearchQuery(''); setSelectedCategory('all'); setSortBy('default');
                            setMinRating(0); setPriceRange({ min: '', max: '' }); setCurrentPage(1);
                        }}
                        style={{ padding: '9px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', alignSelf: 'flex-end' }}
                    >
                        🔄 Reset
                    </button>
                </div>

                {/* INFO BAR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                        Menampilkan <strong>{paginatedProducts.length}</strong> dari <strong>{filteredProducts.length}</strong> produk
                        {selectedCategory !== 'all' && <> — <span style={{ textTransform: 'capitalize', color: '#007bff' }}>{selectedCategory}</span></>}
                    </p>
                    {loading && (
                        <span style={{ fontSize: '13px', color: '#888' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #ccc', borderTop: '2px solid #007bff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '6px', verticalAlign: 'middle' }} />
                            Memuat...
                        </span>
                    )}
                </div>

                {/* PRODUCT GRID */}
                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                        <p style={{ fontSize: '40px' }}>🔍</p>
                        <p>Tidak ada produk yang sesuai dengan filter.</p>
                    </div>
                ) : (
                    <div
                        className="product-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '20px',
                            marginBottom: '32px',
                        }}
                    >
                        {paginatedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => setSelectedProduct(product)}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: '#fff', color: currentPage === 1 ? '#ccc' : '#333' }}
                        >
                            ‹ Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: currentPage === page ? '#007bff' : '#fff',
                                    color: currentPage === page ? '#fff' : '#333',
                                    fontWeight: currentPage === page ? 'bold' : 'normal',
                                }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: '#fff', color: currentPage === totalPages ? '#ccc' : '#333' }}
                        >
                            Next ›
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL DETAIL PRODUK */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={addToCart}
                />
            )}

            {/* CART SIDEBAR */}
            {showCart && (
                <Cart
                    items={cartItems}
                    onClose={() => setShowCart(false)}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                />
            )}
        </div>
    );
}

export default ProductCatalog;