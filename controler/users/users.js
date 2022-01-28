const signUp = async (req, res, next) => {
  const token = v4();
  try {
    const user = await getUserByEmail(req.body.email);
    if (user)
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    await addUser(req.body, gravatar.url(req.body.email), token);

    const emailOptions = {
      from: "spercorep@gmail.com",
      to: req.body.email,
      subject: "Nodemailer test",
      html: `<a href="http://localhost:3000/api/users/verify/${token}">verification link</a>`,
    };

    await transporter.sendMail(emailOptions).then((info) =>
      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          message: "Check your email",
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { signUp };
