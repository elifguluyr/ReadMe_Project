const axios = require('axios');

async function testSearch() {
    const q = 'harry potter';
    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=15`
        );
        console.log('Success! Items count:', response.data.items ? response.data.items.length : 0);
        if (response.data.items) {
            const results = response.data.items.map(item => ({
                googleId: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || ["Yazar Bilgisi Yok"],
                description: item.volumeInfo.description || "Açıklama bulunmuyor.",
                categories: item.volumeInfo.categories || [],
                imageLinks: item.volumeInfo.imageLinks || { thumbnail: "https://via.placeholder.com/150" },
                averageRating: item.volumeInfo.averageRating || 0,
                ratingsCount: item.volumeInfo.ratingsCount || 0
            }));
            console.log('First result:', results[0]);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testSearch();
