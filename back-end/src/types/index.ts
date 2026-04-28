import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
	user: { id: string; email: string; role: string };
}

export type JwtUserPayload = {
	id: string;
	email: string;
	role: string;
};
