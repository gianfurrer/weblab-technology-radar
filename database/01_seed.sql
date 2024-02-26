CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO account (email, password, role)
VALUES ('cto@technology-radar.ch', crypt('cto-password', gen_salt('bf', 5)), 'CTO'),
       ('tech-lead@technology-radar.ch', crypt('tech-lead-password', gen_salt('bf', 5)), 'Tech-Lead'),
       ('user@technology-radar.ch', crypt('user-password', gen_salt('bf', 5)), 'User');

INSERT INTO technology (name, category, ring, description, ring_reason, created_by, published, published_at)
SELECT 'Kubernetes', 'Platforms'::category, 'Adopt'::ring, 'Cluster', 'Because Adopt', account.id, false, NULL
FROM account WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'AgroCD', 'Tools'::category, 'Trial'::ring, 'Kubernetes Cluster', 'Because Trial', account.id, true, now()::timestamp
FROM account WHERE email = 'cto@technology-radar.ch'
UNION ALL
SELECT 'GitOps', 'Techniques'::category, 'Assess'::ring, 'Technique for deploying Applications', 'Because Assess', account.id, false, NULL
FROM account WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'Web components for SSR', 'Techniques'::category, 'Hold'::ring, 'Server Side Rendering', NULL, account.id, false, NULL
FROM account WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'Design Systems', 'Techniques'::category, 'Adopt'::ring,
'As application development becomes increasingly dynamic and complex,
its a challenge to deliver accessible and usable products with consistent style.
This is particularly true in larger organizations with multiple teams
working on different products.', 'Because Adopt', account.id, true, now()::timestamp
FROM account WHERE email = 'cto@technology-radar.ch';

INSERT INTO ring_history (technology_id, ring, ring_reason, changed_by, changed_at)
SELECT technology.id, technology.ring, technology.ring_reason, technology.created_by, now()::timestamp
FROM technology WHERE ring_reason IS NOT NULL;
