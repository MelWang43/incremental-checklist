import express from "express";

const boardsRouter = express.Router({ mergeParams: true});

// Insert a new board into database
// POST /api/projects/:pid/boards
boardsRouter.post("/", async (req, res) => {
    const projectID = req.params.pid;
    const {name, index } = req.body;

    const { data, error } = await req.supabase
        .from("boards")
        .insert({
            project_id: projectID,
            name: name,
            index: index,
        })
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// READ ALL
// GET /api/projects/:pid/boards
boardsRouter.get("/", async (req, res) => {
    const projectID = req.params.pid;

    console.log("Project ID: ", projectID)

    const { data, error } = await req.supabase
        .from("boards")
        .select("*")
        .eq("project_id", projectID)
        .order("index", { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// READ ONE
// GET /api/projects/:id
boardsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(data);
});


// UPDATE
// PUT /api/projects/:pid/boards/:id
boardsRouter.put("/:id", async (req, res) => {
    const { pid, id } = req.params;
    const { name, index } = req.body;

    const { data, error } = await req.supabase
        .from("boards")
        .update({
            name,
            index
        })
        .eq("id", id)
        .eq("project_id", pid)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


// DELETE
// DELETE /api/projects/:id
boardsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await req.supabase
        .from("boards")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


export default boardsRouter;