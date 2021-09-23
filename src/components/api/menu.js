export const menus = [
	{
		name: "Dashboard",
		roles: ["m", "ad", "sa"],
		key: "dashboard",
		child: [
			{
				name: "My User Roles",
				link: "/app/roleDetails",
				roles: ["ad", "sa", "m"],
				key: "report",
			},
			{
				name: "My Projects",
				link: "/app/translations/projects",
				roles: ["m", "ad"],
				key: "my_projects",
			},
			{
				name: "Available Sources",
				link: "/app/translations/sources",
				roles: ["m", "ad", "sa"],
				key: "sources",
			},
			{
				name: "My Organisations",
				link: "/app/organisations/create",
				roles: ["m", "ad"],
				key: "create_organisations",
			},
			{
				name: "Verify Organisation",
				link: "/app/organisations",
				roles: ["sa"],
				key: "organisations",
			},
			{
				name: "Create/Assign Projects",
				link: "/app/projects",
				roles: ["member", "ad"],
				key: "projects",
			},
			{
				name: "Users List",
				link: "/app/users",
				roles: ["sa"],
				key: "users",
			},

			{
				name: "Reports Dashboard",
				link: "/app/report",
				roles: ["ad", "sa"],
				key: "report",
			},
		],
	},

	// {
	//     name: 'Translations',
	//     roles: ['m', 'ad', 'sa'],
	//     key: 'translations',
	//     child: [
	//         {
	//             name: 'Sources',
	//             link: '/app/translations/sources',
	//             roles: ['m', 'ad', 'sa'],
	//             key: 'sources'
	//         },
	//         {
	//             name: 'My projects',
	//             link: '/app/translations/projects',
	//             roles: ['m', 'ad', 'sa'],
	//             key: 'my_projects'
	//         },
	//     ]
	// },
];
