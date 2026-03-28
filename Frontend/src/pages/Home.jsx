import { useState, useEffect } from 'react';
import bookService from '../services/book.service';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks();
        console.log("DB'den gelen kitap verisi:", response);
        
        let booksData = [];
        if (Array.isArray(response)) {
           booksData = response;
        } else if (response && Array.isArray(response.books)) {
           booksData = response.books;
        } else if (response && Array.isArray(response.data)) {
           booksData = response.data;
        }
        
        setBooks(booksData);
      } catch (error) {
        console.error('Kitaplar yüklenirken hata:', error);
        setErrorInfo("API Hatası: " + (error.message || JSON.stringify(error)));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    // Ana konteyner: H-screen ile eğer App.jsx de header varsa ona göre yüksekliğini ayarlar. 
    // Sayfa içinde kaymayı engellemek için ana hatlar sticky/overflow-auto.
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8f6f0] font-sans">
      
      {/* 1) SOL TARAF: NAVBAR (ELİF'İN ALANI) - Placeholder */}
      <aside className="w-[240px] bg-[#f0ebd8] border-r border-[#e3dac1] flex flex-col pt-8 pb-4 px-6 shadow-sm z-20 shrink-0">
        <div className="mb-10 pl-2">
          <span className="text-xs font-bold text-wood/50 uppercase tracking-widest">[ Elif'in Alanı ]</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-sage/20 text-navy font-bold border border-sage/30 shadow-sm cursor-not-allowed">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Home
          </div>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/40 text-wood/80 font-medium cursor-not-allowed transition-colors">
            <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            My Library
          </div>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/40 text-wood/80 font-medium cursor-not-allowed transition-colors">
            <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Social
          </div>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/40 text-wood/80 font-medium cursor-not-allowed transition-colors">
            <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </div>
        </nav>
      </aside>

      {/* ORTA VE SAĞ KOLON KAPSAYICI */}
      <div className="flex-1 flex h-full overflow-hidden">
        
        {/* 2) ORTA BÖLÜM: ARAMA + SOSYAL AKIŞ */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-cream/30">
          
          {/* ÜST ORTA KISIM: SEARCH BAR (ELİF'İN ALANI) */}
          <header className="h-[84px] shrink-0 bg-cream/80 backdrop-blur-2xl border-b border-sage/20 flex items-center px-10 z-20 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)]">
            <span className="text-xs font-bold text-wood/60 uppercase tracking-widest mr-6">[ Elif ]</span>
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <div className="bg-sage/15 p-2 rounded-full mt-0.5 ml-0.5">
                  <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Search books..." 
                readOnly
                className="w-full bg-white/90 backdrop-blur-md border border-sage/30 shadow-sm rounded-full pl-14 pr-6 py-3 text-navy font-bold placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow cursor-not-allowed"
              />
            </div>
          </header>

          {/* ORTA ALAN: SOSYAL (VERDA'NIN ALANI) */}
          <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide">
            <div className="mb-10">
              <span className="text-xs font-bold text-wood/50 uppercase tracking-widest">[ Verda'nın Alanı - Geniş Akış ]</span>
              <h1 className="text-3xl font-extrabold text-navy mt-2">Sosyal Akış</h1>
            </div>
            
            {/* Feed Placeholders */}
            <div className="max-w-3xl space-y-10">
              {[1, 2, 3].map((val) => (
                <div key={val} className="bg-white/80 p-6 rounded-3xl border border-sage/20 shadow-lg shadow-navy/5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-navy/80 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold font-serif text-xl">U</span>
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-wood/20 rounded-full mb-2"></div>
                      <div className="h-3 w-20 bg-sage/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 w-full bg-sage/10 rounded-full"></div>
                    <div className="h-4 w-[85%] bg-sage/10 rounded-full"></div>
                    <div className="h-4 w-[60%] bg-sage/10 rounded-full"></div>
                  </div>
                  <div className="w-full h-[220px] bg-gradient-to-br from-cream to-sage/20 rounded-2xl flex items-center justify-center border-2 border-sage/20 border-dashed">
                    <span className="text-wood/50 font-bold tracking-wide">Post Görsel / Kart Taslağı</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* 3) SAĞ TARAF: KİTAPLIK (EFSA'NIN ALANI) - Uygulamayla Bütünleşik Uyumlu Tasarım */}
        <aside className="w-[35%] min-w-[340px] max-w-[480px] bg-cream/50 border-l-[1px] border-sage/20 shadow-[inset_0_0_40px_rgba(244,243,236,0.5)] flex flex-col z-30 relative backdrop-blur-3xl min-h-[500px]">
          
          {/* İç Mekan Efekti */}
          <div className="absolute inset-0 bg-wood/5 pointer-events-none"></div>

          {/* Üst Kısım İsimlik */}
          <div className="relative z-10 px-8 pt-8 pb-5 flex flex-col items-center border-b-[2px] border-sage/20 bg-cream/80 shadow-sm backdrop-blur-lg">
            <span className="text-wood/70 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-90">[ Ziyaret Ettiğin ]</span>
            <div className="bg-gradient-to-br from-wood/10 to-sage/10 px-10 py-2 rounded-xl border border-wood/20 shadow-md">
              <h2 className="text-2xl font-serif font-black text-navy uppercase tracking-[0.2em] drop-shadow-sm">
                Kütüphane
              </h2>
            </div>
          </div>

          {/* Hata ve Ham Veri Ayıklama Alanı (Görünmezse Diye Sabit Siyah Çerçeve) */}
          {errorInfo && (
            <div className="m-4 p-4 bg-red-100 text-red-800 text-xs font-mono font-bold border-2 border-red-500 rounded-lg shadow-lg relative z-50">
              [SİSTEM BİLGİSİ] {errorInfo}
            </div>
          )}

          {/* Kitap Rafları (Güvenli CSS: overflow-auto yerine güvenli kaydırma ve fixed height) */}
          <div className="w-full flex-1 overflow-y-auto relative z-10 px-8 py-10" style={{ minHeight: "400px" }}>
            
            {loading ? (
              <div className="flex justify-center items-start pt-20 h-full w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-navy"></div>
              </div>
            ) : books.length > 0 ? (
              <div className="w-full h-full pb-20">
                {/* CSS Grid'in çökmesini engellemek için min-height ve display flex kolon özellikleri */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-24 justify-items-center">
                  {books.map((book, idx) => {
                    const bookTitle = book.title || 'İsimsiz Kitap';
                    const bookAuthor = (book.author || book.authors?.[0] || 'Bilinmeyen Yazar');
                    
                    return (
                      <div key={book._id || idx} className="w-[120px] flex flex-col justify-end items-center relative" style={{ height: "180px" }}>
                        
                        {/* Kapak Tasarımı */}
                        {book.imageLinks?.thumbnail ? (
                          <img 
                            src={book.imageLinks.thumbnail.replace('http:', 'https:')} 
                            alt={bookTitle} 
                            className="w-full h-[160px] object-cover rounded shadow-[4px_4px_15px_rgba(0,0,0,0.15)] z-10 border border-sage/10 relative"
                          />
                        ) : (
                          // Kapak yoksa temanın renkleriyle zarif illüzyon
                          <div className="w-full h-[160px] bg-gradient-to-br from-navy via-navy/90 to-sage/80 rounded shadow-[4px_4px_15px_rgba(0,0,0,0.15)] z-10 border border-navy/20 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                            <h4 className="text-cream font-serif text-[11px] font-bold text-center leading-snug break-words line-clamp-4 drop-shadow-md">
                              {bookTitle}
                            </h4>
                          </div>
                        )}
                        
                        {/* Zarif Uyumlu Raf Zemini (Fixed boyutta kalas) */}
                        <div className="absolute bottom-[-16px] w-[150px] h-[12px] bg-gradient-to-b from-wood/40 to-wood/60 border-t border-wood/30 border-b-[3px] border-wood/70 rounded-[2px] shadow-[0_15px_20px_rgba(139,90,43,0.15)] z-0 block"></div>
                        
                        {/* Minimal Yazar İsmi */}
                        <div className="absolute bottom-[-32px] w-[140px] text-center z-20">
                          <span className="bg-cream/95 px-3 py-1 rounded shadow-md text-[9px] font-extrabold text-navy uppercase tracking-wider inline-block border border-sage/20 truncate w-full">
                            {typeof bookAuthor === 'string' ? bookAuthor.split(',')[0].substring(0, 16) : bookAuthor}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-white/50 border-[2px] border-sage/30 rounded-xl text-navy shadow-sm relative z-50">
                <p className="font-bold text-lg mb-2">Kitaplık Boş!</p>
                <p className="text-sm">Eğer veritabanınızda kitap olduğundan eminseniz API yanıtı: {JSON.stringify(books)}</p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Home;
