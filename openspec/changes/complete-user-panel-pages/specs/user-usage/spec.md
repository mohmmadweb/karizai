# Spec Delta

## Purpose

مصرف شخصی کاربر.

## ADDED Requirements

### Requirement: Usage trends
«مصرف من» SHALL مصرف روزانه، هفتگی و ماهانه را با تعداد درخواست و توکن نشان دهد و کاربر بین بازه‌ها جابه‌جا شود.

#### Scenario: Switch period
- **WHEN** کاربر «ماهانه» را می‌زند
- **THEN** آمار ماهانه نشان داده می‌شود

### Requirement: Usage breakdown
مصرف SHALL به تفکیک مدل و Agent نشان داده شود و فقط مصرف خود کاربر باشد.

#### Scenario: By model and Agent
- **WHEN** کاربر صفحه را می‌بیند
- **THEN** دو جدول «به تفکیک مدل» و «به تفکیک Agent» دیده می‌شود

#### Scenario: No usage
- **WHEN** در بازه مصرفی نیست
- **THEN** حالت خالی دیده می‌شود

### Requirement: Quota and warning
سهمیه‌ی باقی‌مانده و زمان بازنشانی SHALL دیده شود و نزدیک‌شدن به سقف (۸۰٪ یا بیشتر) با اعلان ساده بگوید.

#### Scenario: Near limit
- **WHEN** مصرف از ۸۰٪ سهمیه گذشته
- **THEN** اعلان هشدار با زمان بازنشانی دیده می‌شود
