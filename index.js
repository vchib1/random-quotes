const express = require("express");

const quotes = require("./json/quotes.json");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/",(req,res)=>{
    res.send({
        status:res.statusCode,
        name:"QuotesAPI",
        getMethod:{
            allQuotes: "/api/quotes",
            allAuthors: "/api/authors",
            pageNum: "/api/quotes?page=1",
            perPage: "/api/quotes?perPage=20",
            pageNum_and_perPage:"/api/quotes?perPage=20",
            searchCategory: "/api/quotes?Category=success",
            searchAuthor: "/api/authors?Author=Sidney Madwed"
        }
    });
});

app.get('/api/quotes', (req, res) => {
    const filters = req.query;
    const page = parseInt(filters.page) || 1;
    const perPage = parseInt(filters.perPage) || 10;
    let filteredQuotes = quotes;

    if (filters.Category) {
        const categories = filters.Category.split(',');
        filteredQuotes = filteredQuotes.filter(quote => categories.includes(quote.Category));
    }

    // Shuffle the quotes array
    const shuffledQuotes = filteredQuotes.sort(() => 0.5 - Math.random());

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedQuotes = shuffledQuotes.slice(startIndex, endIndex);

    res.json({
        totalQuotes: shuffledQuotes.length,
        currentPage: page,
        quotesPerPage: perPage,
        quotes: paginatedQuotes
    });
});

app.get('/api/authors', (req, res) => {
    const filters = req.query;
    const page = parseInt(filters.page) || 1;
    const perPage = parseInt(filters.perPage) || 10;

    let filteredQuotes = quotes;

    if (filters.Author) {
        filteredQuotes = filteredQuotes.filter(quote => quote.Author === filters.Author);
    }

    // Shuffle the quotes array
    const shuffledQuotes = filteredQuotes.sort(() => 0.5 - Math.random());

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedQuotes = shuffledQuotes.slice(startIndex, endIndex);

    res.json({
        totalQuotes: shuffledQuotes.length,
        currentPage: page,
        quotesPerPage: perPage,
        quotes: paginatedQuotes
    });
});

app.listen(port, () => console.log(`Listening on port ${port}..`));
