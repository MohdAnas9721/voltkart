export const nestCategories = (categories = []) => {
  const parents = categories.filter((category) => !category.parentCategory);
  return parents.map((parent) => ({
    ...parent,
    children: categories.filter((category) => category.parentCategory?._id === parent._id)
  }));
};
