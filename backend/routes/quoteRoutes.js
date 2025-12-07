const express = require('express')
const router = express.Router()
const Quote = require('../models/Quote')
const authMiddleware = require('../middleware/authmiddleware');

// get all quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get a quote by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const quote = await Quote.findById(id);
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// user posts a new quote

router.post('/', async (req, res) => {
    try {
        const { quote_text } = req.body;
        if (!quote_text) return res.status(400).json({ message: 'Quote text is required' });

        const newQuote = new Quote({
            user_id: req.user?.id || null,
            quote_text,
            status: 'Pending'
        });

        await newQuote.save();
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { quote_text, status } = req.body;
        let quote = await Quote.findById(req.params.id);

        if (!quote) return res.status(404).json({ message: 'Quote not found' });

        quote.quote_text = quote_text || quote.quote_text;
        quote.status = status || quote.status;

        await quote.save();
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE a quote
 * Route: DELETE /api/quotes/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);

        if (!quote) return res.status(404).json({ message: 'Quote not found' });

        await quote.deleteOne();
        res.json({ message: 'Quote deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router