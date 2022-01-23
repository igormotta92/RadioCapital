select * from sequelizemeta;

-- User Admin
insert users (login, email, `password`, `name`, is_admin, created_at, updated_at) 
value ('admin', 'admin@gmail.com', '123', 'administrador', 1, now(), now());

select * from users;

-- User Investor
insert users (login, email, `password`, `name`, created_at, updated_at) 
value ('investor', 'investor@gmail.com', '123', 'investidor', now(), now());

insert users (login, email, `password`, `name`, created_at, updated_at) 
value ('investor_2', 'investor_2@gmail.com', '123', 'investidor_2', now(), now());

insert investors (id_user, id_consultant) value (2, 1);
insert investors (id_user, id_consultant) value (5, 1);

select * from investors;

-- User Consultant
insert users (login, email, `password`, `name`, created_at, updated_at) 
value ('consultant', 'consultant@gmail.com', '123', 'consultant', now(), now());

insert consultants (id_user) value (3);

select * from consultants;

-- User Administrator

insert users (login, email, `password`, `name`, created_at, updated_at) 
value ('administrator', 'administrator@gmail.com', '123', 'administrator', now(), now());

insert administrators (id_user) value (4);

select * from administrators;

-- Contracts
insert contracts (id_investor, `begin`, `time`, `value`, created_at, updated_at) 
value (4, now(), 12, 10000, now(), now());

select * from contracts;

-- Contracts_pay_month
insert contract_pay_competences (id_contract, `value`, `competence`, `id_user`, created_at, updated_at) 
value (1, 1000, '202004', 1, now(), now());

select * from contract_pay_competences;