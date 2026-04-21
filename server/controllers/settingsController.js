const asyncHandler = require('express-async-handler');
const { getSettings } = require('../utils/pricing');

exports.getSettings = asyncHandler(async (req, res) => {
  res.json(await getSettings());
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});
