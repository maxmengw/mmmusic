export const swaggerSchemas = {
	AddKoreanToExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "BTS",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "Springday",
			},
		},
	},

	DeleteKoreanFromExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "BTS",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "Springday",
			},
		},
	},

	AddChineseToExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "Beyond",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "喜欢你",
			},
		},
	},

	DeleteChineseFromExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "Beyond",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "喜欢你",
			},
		},
	},
	AddFilipinoToExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "Slapshock",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "Shezo Wicked",
			},
		},
	},

	DeleteFilipinoFromExampleDto: {
		type: "object",
		required: ["name", "example"],
		properties: {
			name: {
				type: "string",
				description: "Singer name",
				example: "Slapshock",
			},
			example: {
				type: "string",
				description: "Music name (minimum 3 characters)",
				minLength: 3,
				example: "Shezzo Wicked",
			},
		},
	},
	
	AddToPlaylistDto: {
		type: "object",
		required: ["title", "artist", "videoId"],
		properties: {
			title: {
				type: "string",
				description: "Music title",
				example: "LOVE MAZE",
			},
			artist: {
				type: "string",
				description: "Artist name",
				example: "BTS",
			},
			videoId: {
				type: "string",
				description: "YouTube video ID",
				example: "h778hgEP1JI",
			},
		},
	},
};