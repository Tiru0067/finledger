export const getAllRecords = (req, res) => {
  res.status(200).json({ message: "GET /records - not implemented yet" });
};

export const getRecord = (req, res) => {
  res.status(200).json({ message: "GET /records/:id - not implemented yet" });
};

export const createRecord = (req, res) => {
  res.status(201).json({ message: "POST /records - not implemented yet" });
};

export const updateRecord = (req, res) => {
  res.status(200).json({ message: "PUT /records/:id - not implemented yet" });
};

export const deleteRecord = (req, res) => {
  res
    .status(204)
    .json({ message: "DELETE /records/:id - not implemented yet" });
};
