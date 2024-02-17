
WITH account_ids AS (
  INSERT INTO account (email, password, role) 
  VALUES ('cto@technology-radar.ch', crypt('cto-password', gen_salt('bf', 5)), 'CTO'),
         ('tech-lead@technology-radar.ch', crypt('tech-lead-password', gen_salt('bf', 5)), 'Tech-Lead'),
         ('user@technology-radar.ch', crypt('user-password', gen_salt('bf', 5)), 'User')
  RETURNING id, email
)
INSERT INTO technology (name, category, ring, description, created_by)
SELECT 'AgroCD', 'Tools', 'Trial', 'Kubernetes Cluster', account_ids.id
FROM account_ids WHERE email = 'cto@technology-radar.ch';
