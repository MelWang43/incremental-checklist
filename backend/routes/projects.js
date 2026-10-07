import express from "express";

const projectsRouter = express.Router();

// Insert a new job into the database
// POST /api/projects
projectsRouter.post("/", async (req, res) => {
    const {name, description } = req.body;

    const { data, error } = await req.supabase
        .from("projects")
        .insert({
            user_id: req.user.id,
            name: name,
            description: description,
        })
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// READ ALL
// GET /api/projects
projectsRouter.get("/", async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await req.supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("accessed_at", { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// READ ONE
// GET /api/projects/:id
projectsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(data);
});


// UPDATE
// PUT /api/projects/:id
projectsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, accessed_at } = req.body;

    const { data, error } = await req.supabase
        .from("projects")
        .update({
            name: name,
            description: description,
            accessed_at: accessed_at,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// DELETE
// DELETE /api/projects/:id
projectsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


export default projectsRouter;