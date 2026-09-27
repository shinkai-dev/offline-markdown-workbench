# Order Management System - Database Schema Specification

## 1. Overview

This document serves as the database schema design specification for the Order Management System (OMS) of an enterprise e-commerce platform.
The system handles core business domains including order processing, inventory allocation, payment processing, shipping dispatch, and customer support history.

## 2. Table Overview

Below is the list of all 50 database tables managed by this system.

| Table ID | Table Name (Physical) | Logical Name | Category | Est. Record Count | Status | Owner Team | Last Updated |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| TBL-001 | `t_orders` | Order Header | Transaction | 10,000,000+ | Active | Order Team | 2026-08-15 |
| TBL-002 | `m_users` | User Accounts | Master | 1,000,000+ | Active | User Team | 2026-08-10 |
| TBL-003 | `t_order_items` | Order Items | Transaction | 30,000,000+ | Active | Order Team | 2026-08-15 |
| TBL-004 | `m_products` | Products | Master | 500,000 | Active | Catalog Team | 2026-07-20 |
| TBL-005 | `t_payments` | Payment Transactions | Transaction | 12,000,000+ | Active | Payment Team | 2026-08-18 |
| TBL-006 | `m_payment_methods` | Payment Methods | Master | 20 | Active | Payment Team | 2026-05-11 |
| TBL-007 | `t_shipments` | Shipments | Transaction | 8,000,000+ | In Review | Logistics Team | 2026-09-01 |
| TBL-008 | `m_warehouses` | Warehouses | Master | 50 | Active | Logistics Team | 2026-06-15 |
| TBL-009 | `t_inventory` | Inventory Logs | Transaction | 50,000,000+ | In Review | Logistics Team | 2026-09-02 |
| TBL-010 | `m_categories` | Categories | Master | 1,500 | Active | Catalog Team | 2026-06-01 |
| TBL-011 | `m_brands` | Brands | Master | 800 | Active | Catalog Team | 2026-06-05 |
| TBL-012 | `t_coupons` | Issued Coupons | Transaction | 2,000,000+ | Active | Marketing Team | 2026-07-29 |
| TBL-013 | `m_coupon_templates` | Coupon Templates | Master | 300 | Active | Marketing Team | 2026-07-25 |
| TBL-014 | `m_user_ranks` | User Tier Ranks | Master | 10 | Active | User Team | 2026-04-01 |
| TBL-015 | `t_cart` | Shopping Carts | Temporary | 500,000 | Active | Storefront Team | 2026-08-12 |
| TBL-016 | `t_cart_items` | Shopping Cart Items | Temporary | 1,500,000 | Active | Storefront Team | 2026-08-12 |
| TBL-017 | `m_suppliers` | Suppliers | Master | 3,000 | Active | Vendor Team | 2026-04-10 |
| TBL-018 | `t_purchase_orders` | Purchase Orders | Transaction | 100,000 | Draft | Vendor Team | 2026-09-10 |
| TBL-019 | `m_product_tags` | Product Tags | Master | 5,000 | Active | Catalog Team | 2026-06-18 |
| TBL-020 | `t_returns` | Return Requests | Transaction | 50,000 | Active | CS Team | 2026-08-01 |
| TBL-021 | `m_return_reasons` | Return Reasons | Master | 15 | Active | CS Team | 2026-03-15 |
| TBL-022 | `t_reviews` | Product Reviews | Content | 3,000,000+ | Active | Media Team | 2026-07-11 |
| TBL-023 | `m_review_badges` | Review Badges | Master | 25 | Draft | Media Team | 2026-09-08 |
| TBL-024 | `t_audit_logs` | System Audit Logs | Audit | 100,000,000+ | Active | Core Team | 2026-08-30 |
| TBL-025 | `m_tax_rates` | Tax Rates | Master | 10 | Active | Finance Team | 2026-01-05 |
| TBL-026 | `m_currencies` | Currencies | Master | 50 | Active | Finance Team | 2026-01-10 |
| TBL-027 | `t_invoices` | Invoices | Transaction | 10,000,000+ | Draft | Finance Team | 2026-09-12 |
| TBL-028 | `m_shipping_carriers` | Carriers | Master | 12 | Active | Logistics Team | 2026-05-20 |
| TBL-029 | `m_shipping_rates` | Shipping Rates | Master | 500 | In Review | Logistics Team | 2026-08-28 |
| TBL-030 | `t_user_addresses` | User Address Book | Master | 2,500,000 | Active | User Team | 2026-08-05 |
| TBL-031 | `t_notifications` | User Notifications | Transaction | 20,000,000+ | Deprecated | Core Team | 2026-06-30 |
| TBL-032 | `m_notification_templates` | Notification Templates | Master | 150 | Active | Core Team | 2026-07-02 |
| TBL-033 | `m_campaigns` | Marketing Campaigns | Master | 200 | Active | Marketing Team | 2026-08-22 |
| TBL-034 | `t_points_history` | Reward Points Ledger | Transaction | 40,000,000+ | Active | Marketing Team | 2026-08-19 |
| TBL-035 | `m_point_rules` | Reward Rules | Master | 30 | Active | Marketing Team | 2026-05-14 |
| TBL-036 | `t_api_access_logs` | API Logs | Audit | 500,000,000+ | In Review | Core Team | 2026-09-05 |
| TBL-037 | `m_system_config` | System Configurations | System | 100 | Active | Core Team | 2026-02-01 |
| TBL-038 | `t_temp_registrations` | Pending User Signups | Temporary | 10,000 | Active | User Team | 2026-07-01 |
| TBL-039 | `m_regions` | Regions & States | Master | 47 | Active | Core Team | 2025-11-01 |
| TBL-040 | `m_zip_codes` | Postal Codes | Master | 150,000 | Active | Core Team | 2026-03-01 |
| TBL-041 | `m_store_locations` | Retail Stores | Master | 120 | In Review | Omnichannel Team | 2026-08-30 |
| TBL-042 | `t_store_stock` | Retail Store Stock | Transaction | 5,000,000 | Draft | Omnichannel Team | 2026-09-11 |
| TBL-043 | `m_gift_wrappings` | Gift Wrapping Options | Master | 20 | Active | Logistics Team | 2026-04-18 |
| TBL-044 | `t_gift_messages` | Gift Messages | Transaction | 300,000 | Active | Order Team | 2026-07-15 |
| TBL-045 | `m_promotions` | Discounts & Promotions | Master | 80 | Draft | Marketing Team | 2026-09-01 |
| TBL-046 | `m_vendors` | External Vendors | Master | 40 | Active | Vendor Team | 2026-02-20 |
| TBL-047 | `t_vendor_payouts` | Vendor Payouts | Transaction | 15,000 | In Review | Finance Team | 2026-09-03 |
| TBL-048 | `m_blacklists` | Fraud Blacklists | Master | 1,200 | Active | Security Team | 2026-08-11 |
| TBL-049 | `t_security_alerts` | Security Alerts | Audit | 2,000,000 | Active | Security Team | 2026-08-29 |
| TBL-050 | `m_faq_categories` | Help Desk Categories | Master | 30 | Active | CS Team | 2026-05-01 |

## 3. Detailed Schema Specification

### 3.1 Order Header (`t_orders`)

Stores primary order details placed by users.

* **Table Name**: `t_orders`
* **Primary Key**: `order_id`
* **Charset**: UTF-8MB4

| Column ID | Field Name | Logical Name | Data Type | Nullable | Default | Constraints / Description |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| COL-001 | `order_id` | Order ID | BIGINT | NO | Auto Increment | PK, Primary internal identifier |
| COL-002 | `order_code` | Order Reference Code | VARCHAR(32) | NO | - | UNIQUE, Human-readable reference |
| COL-003 | `user_id` | User ID | BIGINT | NO | - | FK (`m_users.user_id`) |
| COL-004 | `order_status` | Order Status | VARCHAR(16) | NO | 'PENDING' | Enum: PENDING, PAID, SHIPPED, CANCELED |
| COL-005 | `total_amount` | Total Amount | DECIMAL(12,2) | NO | 0.00 | Total price including tax |
| COL-006 | `tax_amount` | Tax Amount | DECIMAL(10,2) | NO | 0.00 | Total calculated tax |
| COL-007 | `shipping_fee` | Shipping Fee | DECIMAL(8,2) | NO | 0.00 | Delivery charge |
| COL-008 | `discount_amount` | Discount Amount | DECIMAL(10,2) | NO | 0.00 | Discount applied via coupon/points |
| COL-009 | `payment_method_id` | Payment Method ID | INT | NO | - | FK (`m_payment_methods.payment_id`) |
| COL-010 | `shipping_address_id` | Address ID | BIGINT | YES | NULL | FK (`t_user_addresses.address_id`) |
| COL-011 | `ordered_at` | Order Date | DATETIME | NO | CURRENT_TIMESTAMP | Timestamp when order was placed |
| COL-012 | `updated_at` | Last Updated | DATETIME | YES | NULL | ON UPDATE CURRENT_TIMESTAMP |
| COL-013 | `is_deleted` | Soft Delete Flag | TINYINT(1) | NO | 0 | 0: Active, 1: Soft Deleted |

### 3.2 Order Items (`t_order_items`)

Contains individual line items associated with an order.

* **Table Name**: `t_order_items`
* **Primary Key**: `order_item_id`
* **Charset**: UTF-8MB4

| Column ID | Field Name | Logical Name | Data Type | Nullable | Default | Constraints / Description |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| COL-001 | `order_item_id` | Order Item ID | BIGINT | NO | Auto Increment | PK |
| COL-002 | `order_id` | Order ID | BIGINT | NO | - | FK (`t_orders.order_id`) |
| COL-003 | `product_id` | Product ID | BIGINT | NO | - | FK (`m_products.product_id`) |
| COL-004 | `product_sku` | Product SKU | VARCHAR(64) | NO | - | Snapshot of SKU at time of purchase |
| COL-005 | `product_name` | Product Name | VARCHAR(255) | NO | - | Snapshot of Product Name |
| COL-006 | `unit_price` | Unit Price | DECIMAL(10,2) | NO | - | Purchase unit price |
| COL-007 | `quantity` | Quantity | INT | NO | 1 | Item quantity ordered |
| COL-008 | `subtotal_price` | Subtotal | DECIMAL(12,2) | NO | - | `unit_price` * `quantity` |
| COL-009 | `tax_rate_id` | Applied Tax Rate ID | INT | NO | - | FK (`m_tax_rates.tax_rate_id`) |

## 4. Design Standards & Naming Conventions

1. **Table Naming Rules**
   * Master tables: prefixed with `m_` in snake_case (e.g., `m_products`).
   * Transactional tables: prefixed with `t_` in snake_case (e.g., `t_orders`).

2. **Common Fields**
   * All persistent database tables must include `created_at` and `updated_at` timestamp columns.

3. **Soft Delete Policy**
   * Physical deletion of transactional or sensitive data is prohibited; use the `is_deleted` flag for soft deletion instead.