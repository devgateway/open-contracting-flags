const getSupplierIds = release => {
  const supplierIds = release.awards.reduce(
    (allSuppliers, award) => allSuppliers.concat(
      award.suppliers.map(supplier => supplier._id)
    ),
    []
  );
  const uniqueSupplierIds = supplierIds.filter((s, i) => supplierIds.indexOf(s) === i);
  return uniqueSupplierIds;
};

module.exports = getSupplierIds;
