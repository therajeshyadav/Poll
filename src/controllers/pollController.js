import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPoll = async (req, res) => {
  try {
    const { question, creatorId, options } = req.body;

    if (
      !question ||
      !creatorId ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid poll data" });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        creatorId: parseInt(creatorId),
        isPublished: true,
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error(err);

    if (err.code === "P2003") {
      return res
        .status(400)
        .json({ error: true, message: "Invalid creatorId (user not found)" });
    }

    res.status(500).json({ error: true, message: "Poll create failed" });
  }
};

export const getPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: true },
    });

    res.json(polls);
  } catch (err) {
    console.error("Error fetching polls:", err);

    // Prisma error codes handle karo
    if (err.code === "P2025") {
      return res.status(404).json({ error: true, message: "Polls not found" });
    }

    res.status(500).json({ error: true, message: "Failed to fetch polls" });
  }
};

export const getPollById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: true, message: "Invalid poll ID" });

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: { votes: true },
        },
      },
    });

    if (!poll)
      return res.status(404).json({ error: true, message: "Poll not found" });

    const result = {
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votesCount: opt.votes.length,
      })),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Failed to fetch poll" });
  }
};

export const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const updatedPoll = await prisma.poll.update({
      where: { id: parseInt(id) },
      data: { question },
    });

    res.json(updatedPoll);
  } catch (err) {
    res.status(500).json({ error: "Poll update failed" });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: true, message: "Invalid poll ID" });

    await prisma.poll.delete({ where: { id } });

    res.json({ success: true, message: "Poll deleted" });
  } catch (err) {
    console.error(err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: true, message: "Poll not found" });
    }

    res.status(500).json({ error: true, message: "Poll delete failed" });
  }
};


