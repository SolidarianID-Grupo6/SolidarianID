
import * as Domain from '../domain';

export class RegisterUserDtoResponse {
    id: string
    name: string;
    surnames: string;
    email: string;
    isEmailPublic: boolean;
    password: string;
    birthdate: Date;
    isBirthdatePublic: boolean;
    presentation?: string;

    static fromDomain(user: Domain.User): RegisterUserDtoResponse {
        const dto = new RegisterUserDtoResponse()
        {
            dto.id = user.id.toString();
            dto.name = user.name;
            dto.surnames = user.surnames;
            dto.email = user.email;
            dto.isEmailPublic = user.isEmailPublic;
            dto.password = user.password;
            dto.birthdate = new Date(user.birthdate);
            dto.isBirthdatePublic = user.isBirthdatePublic;
            dto.presentation = user.presentation;
        };
        return dto;
    }
}
