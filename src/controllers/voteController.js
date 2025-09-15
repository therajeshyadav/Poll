import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const castVote = (io) => async (req, res) => {
  try {
    const userIdNum = parseInt(req.body.userId);
    const pollOptionIdNum = parseInt(req.body.pollOptionId);

    if (Number.isNaN(userIdNum) || Number.isNaN(pollOptionIdNum)) {
      return res.status(400).json({ error: "Invalid userId or pollOptionId" });
    }

    // Check if option exists
    const option = await prisma.pollOption.findUnique({
      where: { id: pollOptionIdNum },
    });
    if (!option) return res.status(404).json({ error: "Option not found" });

    // Save vote
    const vote = await prisma.vote.create({ data: { userId: userIdNum, pollOptionId: pollOptionIdNum } });

    // Count results for this poll
    const results = await prisma.pollOption.findMany({
      where: { pollId: option.pollId },
      include: { _count: { select: { votes: true } } },
    });

    const formattedResults = results.map((opt) => ({
      optionId: opt.id,
      text: opt.text,
      votes: opt._count.votes,
    }));

    // Broadcast results to all connected clients
    io.to(`poll:${option.pollId}`).emit("broadcastResults", {
      pollId: option.pollId,
      results: formattedResults,
    });

    res.json(vote);
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ error: "User already voted for this option" });
    }
    res.status(500).json({ error: "Failed to cast vote" });
  }
};
