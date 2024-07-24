import Task from "../model/taskSchema.js";

export const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { email, sort, keyword = "" } = req.body;
    const keywordMatch = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    let sortOrder;
    let sortField = "createdAt";

    switch (sort) {
      case "recent":
        sortOrder = -1;
        break;
      case "previous":
        sortOrder = 1;
        break;
      case "asc":
        sortField = "title_lowercase";
        sortOrder = 1;
        break;
      case "desc":
        sortField = "title_lowercase";
        sortOrder = -1;
        break;
      default:
        sortOrder = -1;
    }

    const tasks = await Task.aggregate([
      { $match: { emailId: email } },
      {
        $addFields: {
          title_lowercase: { $toLower: "$title" },
        },
      },
      {
        $facet: {
          NotStarted: [
            { $match: { status: "Not-Started", ...keywordMatch } },
            { $sort: { [sortField]: sortOrder } },
          ],
          InProgress: [
            { $match: { status: "In-Progress", ...keywordMatch } },
            { $sort: { [sortField]: sortOrder } },
          ],
          Done: [
            { $match: { status: "Done", ...keywordMatch } },
            { $sort: { [sortField]: sortOrder } },
          ],
        },
      },
      {
        $project: {
          NotStarted: 1,
          InProgress: 1,
          Done: 1,
        },
      },
    ]);

    res.status(200).json(tasks[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
