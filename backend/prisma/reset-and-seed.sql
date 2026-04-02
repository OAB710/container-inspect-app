BEGIN;

    TRUNCATE TABLE
  "dt_hu_hong_image"
    ,
  "dt_hu_hong",
  "dt_giam_dinh",
  "dt_container",
  "user"
RESTART IDENTITY CASCADE;

    INSERT INTO "user"
        ("username", "password", "full_name", "email", "role")
    VALUES
        ('surveyora', 'Password123!', 'Nguyễn Văn An', 'surveyora@example.com', 'surveyor'),
        ('surveyorb', 'Password123!', 'Trần Thị Bình', 'surveyorb@example.com', 'surveyor'),
        ('surveyorc', 'Password123!', 'Lê Hoàng Cường', 'surveyorc@example.com', 'surveyor'),
        ('surveyd', 'Password123!', 'Phạm Minh Đức', 'surveyd@example.com', 'surveyor'),
        ('surveyore', 'Password123!', 'Võ Thu Em', 'surveyore@example.com', 'surveyor');

    INSERT INTO "dt_container"
        ("container_no", "container_type", "container_size", "status")
    VALUES
        ('CONT-0001', 'GP', 20, 'empty'),
        ('CONT-0002', 'GP', 40, 'inspected'),
        ('CONT-0003', 'HC', 20, 'empty'),
        ('CONT-0004', 'HC', 40, 'maintenance'),
        ('CONT-0005', 'OT', 20, 'reserved'),
        ('CONT-0006', 'GP', 40, 'empty'),
        ('CONT-0007', 'HC', 20, 'damaged'),
        ('CONT-0008', 'GP', 20, 'empty'),
        ('CONT-0009', 'OT', 40, 'empty'),
        ('CONT-0010', 'GP', 20, 'empty'),
        ('CONT-0011', 'HC', 40, 'inspected'),
        ('CONT-0012', 'GP', 20, 'reserved'),
        ('CONT-0013', 'OT', 20, 'maintenance'),
        ('CONT-0014', 'HC', 20, 'empty'),
        ('CONT-0015', 'GP', 40, 'empty'),
        ('CONT-0016', 'OT', 40, 'empty'),
        ('CONT-0017', 'HC', 20, 'empty'),
        ('CONT-0018', 'GP', 20, 'damaged'),
        ('CONT-0019', 'OT', 40, 'reserved'),
        ('CONT-0020', 'HC', 40, 'empty');

    INSERT INTO "dt_giam_dinh"
        ("container_id", "surveyor_id", "inspection_code", "inspection_date", "status", "result", "note", "created_at", "updated_at")
    VALUES
        (2, 1, 'GD-SEEDED-0002', NOW() - INTERVAL
    '2 day', 'completed', 'Đạt', 'Container đã giám định hoàn tất', NOW
    () - INTERVAL '2 day', NOW
    () - INTERVAL '2 day'),
    (11, 2, 'GD-SEEDED-0011', NOW
    () - INTERVAL '1 day', 'completed', 'Đạt', 'Container đã giám định hoàn tất', NOW
    () - INTERVAL '1 day', NOW
    () - INTERVAL '1 day'),
    (6, 3, 'GD-SEEDED-0006', NOW
    (), 'draft', 'Đang cập nhật', 'Bản nháp kiểm tra hiện trạng', NOW
    (), NOW
    ());

    COMMIT;