/**
 * Middleware validate DTO đầu vào (hỗ trợ body, query, params)
 * @param {import('joi').ObjectSchema} schema - Schema DTO định nghĩa bởi Joi
 * @param {'body' | 'query' | 'params'} source - Vị trí dữ liệu cần kiểm tra (mặc định: 'body')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,  // Báo toàn bộ các lỗi vi phạm thay vì dừng ở lỗi đầu
      stripUnknown: true, // Tự động loại bỏ các field thừa/lạ không nằm trong DTO (chống injection rác)
    });

    if (error) {
      // Map lỗi rõ ràng theo từng field
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(422).json({
        success: false,
        error: 'Dữ liệu đầu vào không hợp lệ',
        details: formattedErrors,
      });
    }

    // Gán dữ liệu đã validate và sanitize sạch vào req
    req[source] = value;
    next();
  };
};

module.exports = validate;

