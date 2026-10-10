import express from "express";

const cardsRouter = express.Router();

// Insert a new board into database
// POST /api/cards/
cardsRouter.post("/", async (req, res) => {
    const {board_id, text, index } = req.body;

    const { data, error } = await req.supabase
        .from("cards")
        .insert({
            board_id: board_id,
            text: text,
            index: index,
        })
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// READ ALL FROM A BOARD
// GET /api/cards/board/:bid
cardsRouter.get("/board/:bid", async (req, res) => {
    const {bid} = req.params
    const { data, error } = await req.supabase
        .from("cards")
        .select("*")
        .eq("board_id", bid)
        .order("index", { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// READ ONE
// GET /api/cards
cardsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(data);
});


// UPDATE
// PUT /api/cards/:id
cardsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, index } = req.body;

    const { data, error } = await req.supabase
        .from("cards")
        .update({
            name,
            index
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// DELETE
// DELETE /api/cards/:id
cardsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("cards")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


export default cardsRouter;