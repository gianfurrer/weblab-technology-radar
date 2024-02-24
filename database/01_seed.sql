
WITH account_ids AS (
  INSERT INTO account (email, password, role)
  VALUES ('cto@technology-radar.ch', crypt('cto-password', gen_salt('bf', 5)), 'CTO'),
         ('tech-lead@technology-radar.ch', crypt('tech-lead-password', gen_salt('bf', 5)), 'Tech-Lead'),
         ('user@technology-radar.ch', crypt('user-password', gen_salt('bf', 5)), 'User')
  RETURNING id, email
)
INSERT INTO technology (name, category, ring, description, created_by, created_at, published, published_at)
SELECT 'Kubernetes', 'Platforms'::category, 'Adopt'::ring, 'Cluster', account_ids.id, NOW(), false, NULL
FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'AgroCD', 'Tools'::category, 'Trial'::ring, 'Kubernetes Cluster', account_ids.id, NOW(), true, NOW()
FROM account_ids WHERE email = 'cto@technology-radar.ch'
UNION ALL
SELECT 'GitOps', 'Techniques'::category, 'Assess'::ring, 'Technique for deploying Applications', account_ids.id, NOW(), false, NULL
FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'Web components for SSR', 'Techniques'::category, 'Hold'::ring, 'Server Side Rendering', account_ids.id, NOW(), false, NULL
FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
UNION ALL
SELECT 'Design Systems', 'Techniques'::category, 'Adopt'::ring,
'As application development becomes increasingly dynamic and complex,
its a challenge to deliver accessible and usable products with consistent style.
This is particularly true in larger organizations with multiple teams
working on different products.', account_ids.id, NOW(), true, NOW()
FROM account_ids WHERE email = 'cto@technology-radar.ch';
