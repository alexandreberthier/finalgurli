export interface PersonalData {
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
}

export interface DeliveryData {
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface UserDTO {
    id?: string;
    role?: 'admin' | 'user';
    isAnonymous: boolean;
    personalData?: PersonalData;
    deliveryData?: DeliveryData;
}

const defaultPersonalData: PersonalData = {firstName: '', lastName: '', email: '', phoneNumber: ''};
const defaultDeliveryData: DeliveryData = {street: '', houseNumber: '', postalCode: '', city: '', country: ''};

export class User {
    private _id: string;
    private _role: 'admin' | 'user';
    private _isAnonymous: boolean;
    private _personalData: PersonalData;
    private _deliveryData: DeliveryData;

    constructor(
        id: string = '',
        role: 'admin' | 'user' = 'user',
        isAnonymous: boolean = false,
        personalData: PersonalData = defaultPersonalData,
        deliveryData: DeliveryData = defaultDeliveryData
    ) {
        this._id = id;
        this._role = role;
        this._isAnonymous = isAnonymous;
        this._personalData = personalData;
        this._deliveryData = deliveryData;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value || '';
    }

    get role(): 'admin' | 'user' {
        return this._role;
    }

    set role(value: 'admin' | 'user') {
        this._role = value ?? 'user';
    }

    get isAnonymous(): boolean {
        return this._isAnonymous;
    }

    set isAnonymous(value: boolean) {
        this._isAnonymous = value;
    }

    get personalData(): PersonalData {
        return this._personalData;
    }

    set personalData(value: PersonalData) {
        this._personalData = value ?? defaultPersonalData;
    }

    get deliveryData(): DeliveryData {
        return this._deliveryData;
    }

    set deliveryData(value: DeliveryData) {
        this._deliveryData = value ?? defaultDeliveryData;
    }

    static fromDto(dto: UserDTO): User {
        return new User(
            dto.id ?? '',
            dto.role ?? 'user',
            dto.isAnonymous,
            dto.personalData ?? defaultPersonalData,
            dto.deliveryData ?? defaultDeliveryData
        );
    }

    toDto(): UserDTO {
        return {
            id: this.id || undefined,
            role: this.role || undefined,
            isAnonymous: this.isAnonymous,
            personalData: this.personalData,
            deliveryData: this.deliveryData,
        };
    }
}
