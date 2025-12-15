function allowRoles(...allowed) {
  return (req, res, next) => {
    const roles = [req.userRole] || [];    

    const hasAccess = roles.some((r) => allowed.includes(r));
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    next();
  };
}

module.exports = { allowRoles };
