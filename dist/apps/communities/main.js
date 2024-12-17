/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const cause_module_1 = __webpack_require__(6);
const community_module_1 = __webpack_require__(15);
const action_module_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(7);
const community_requests_module_1 = __webpack_require__(28);
const event_module_1 = __webpack_require__(33);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(`mongodb://admin:admin@localhost:27017/`),
            action_module_1.ActionModule,
            community_module_1.CommunityModule,
            cause_module_1.CauseModule,
            community_requests_module_1.CommunityRequestsModule,
            event_module_1.EventModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(5);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CauseModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const cause_service_1 = __webpack_require__(8);
const cause_controller_1 = __webpack_require__(11);
const cause_schema_1 = __webpack_require__(10);
let CauseModule = class CauseModule {
};
exports.CauseModule = CauseModule;
exports.CauseModule = CauseModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: cause_schema_1.Cause.name, schema: cause_schema_1.CauseSchema }])],
        controllers: [cause_controller_1.CauseController],
        providers: [cause_service_1.CauseService],
    })
], CauseModule);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CauseService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const cause_schema_1 = __webpack_require__(10);
let CauseService = class CauseService {
    constructor(causeModel) {
        this.causeModel = causeModel;
    }
    async create(createCauseDto) {
        const newCause = new this.causeModel(createCauseDto);
        return newCause.save();
    }
    async findAll() {
        return this.causeModel.find().exec();
    }
    async findOne(id) {
        const cause = await this.causeModel.findById(id).exec();
        if (!cause) {
            throw new common_1.NotFoundException(`Cause with ID "${id}" not found`);
        }
        return cause;
    }
    async update(id, updateCauseDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException(`Invalid ID format: "${id}"`);
        }
        const updatedCause = await this.causeModel
            .findByIdAndUpdate(id, updateCauseDto, { new: true, runValidators: true })
            .exec();
        if (!updatedCause) {
            throw new common_1.NotFoundException(`Cause with ID "${id}" not found`);
        }
        return updatedCause;
    }
    async remove(id) {
        const cause = await this.causeModel.findByIdAndDelete(id).exec();
        if (!cause) {
            throw new common_1.NotFoundException(`Cause with ID "${id}" not found`);
        }
    }
};
exports.CauseService = CauseService;
exports.CauseService = CauseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cause_schema_1.Cause.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CauseService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CauseSchema = exports.Cause = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose = __webpack_require__(9);
let Cause = class Cause {
};
exports.Cause = Cause;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cause.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cause.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Cause.prototype, "creationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }] }),
    __metadata("design:type", String)
], Cause.prototype, "community", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Cause.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] }),
    __metadata("design:type", Array)
], Cause.prototype, "actions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] }),
    __metadata("design:type", Array)
], Cause.prototype, "events", void 0);
exports.Cause = Cause = __decorate([
    (0, mongoose_1.Schema)()
], Cause);
exports.CauseSchema = mongoose_1.SchemaFactory.createForClass(Cause);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CauseController = void 0;
const common_1 = __webpack_require__(3);
const cause_service_1 = __webpack_require__(8);
const create_cause_dto_1 = __webpack_require__(12);
const update_cause_dto_1 = __webpack_require__(14);
let CauseController = class CauseController {
    constructor(causeService) {
        this.causeService = causeService;
    }
    async create(createCauseDto) {
        return this.causeService.create(createCauseDto);
    }
    async findAll() {
        return this.causeService.findAll();
    }
    async findOne(id) {
        return this.causeService.findOne(id);
    }
    async update(id, updateCauseDto) {
        return this.causeService.update(id, updateCauseDto);
    }
    async remove(id) {
        return this.causeService.remove(id);
    }
};
exports.CauseController = CauseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_cause_dto_1.CreateCauseDto !== "undefined" && create_cause_dto_1.CreateCauseDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CauseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CauseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CauseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_cause_dto_1.UpdateCauseDto !== "undefined" && update_cause_dto_1.UpdateCauseDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CauseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CauseController.prototype, "remove", null);
exports.CauseController = CauseController = __decorate([
    (0, common_1.Controller)('causes'),
    __metadata("design:paramtypes", [typeof (_a = typeof cause_service_1.CauseService !== "undefined" && cause_service_1.CauseService) === "function" ? _a : Object])
], CauseController);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCauseDto = void 0;
const class_validator_1 = __webpack_require__(13);
class CreateCauseDto {
}
exports.CreateCauseDto = CreateCauseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCauseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCauseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateCauseDto.prototype, "creationDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCauseDto.prototype, "community", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCauseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCauseDto.prototype, "actions", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCauseDto.prototype, "events", void 0);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCauseDto = void 0;
const class_validator_1 = __webpack_require__(13);
class UpdateCauseDto {
}
exports.UpdateCauseDto = UpdateCauseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCauseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCauseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateCauseDto.prototype, "creationDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCauseDto.prototype, "community", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCauseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCauseDto.prototype, "actions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCauseDto.prototype, "events", void 0);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const community_service_1 = __webpack_require__(16);
const community_controller_1 = __webpack_require__(18);
const community_schema_1 = __webpack_require__(17);
let CommunityModule = class CommunityModule {
};
exports.CommunityModule = CommunityModule;
exports.CommunityModule = CommunityModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: community_schema_1.Community.name, schema: community_schema_1.CommunitySchema }])],
        controllers: [community_controller_1.CommunityController],
        providers: [community_service_1.CommunityService],
    })
], CommunityModule);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const community_schema_1 = __webpack_require__(17);
let CommunityService = class CommunityService {
    constructor(communityModel) {
        this.communityModel = communityModel;
    }
    async create(createCommunityDto) {
        const newCommunity = new this.communityModel(createCommunityDto);
        return newCommunity.save();
    }
    async findAll() {
        return this.communityModel.find().exec();
    }
    async findOne(id) {
        const community = await this.communityModel.findById(id).exec();
        if (!community) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        return community;
    }
    async update(id, updateCommunityDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException(`Invalid ID format: "${id}"`);
        }
        const updatedCommunity = await this.communityModel
            .findByIdAndUpdate(id, updateCommunityDto, {
            new: true,
            runValidators: true,
        })
            .exec();
        if (!updatedCommunity) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        return updatedCommunity;
    }
    async remove(id) {
        const cause = await this.communityModel.findByIdAndDelete(id).exec();
        if (!cause) {
            throw new common_1.NotFoundException(`Cause with ID "${id}" not found`);
        }
    }
    async requestJoin(id, userId) {
        const community = await this.communityModel.findById(id).exec();
        if (!community) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        if (community.members.includes(userId)) {
            throw new common_1.BadRequestException(`User with ID "${userId}" is already a member`);
        }
        if (community.pendingRequests.includes(userId)) {
            throw new common_1.BadRequestException(`User with ID "${userId}" has already requested to join`);
        }
        community.pendingRequests.push(userId);
        return community.save();
    }
    async acceptRequest(id, userId) {
        const community = await this.communityModel.findById(id).exec();
        if (!community) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        const requestIndex = community.pendingRequests.indexOf(userId);
        if (requestIndex === -1) {
            throw new common_1.BadRequestException(`No pending request found for user with ID "${userId}"`);
        }
        community.pendingRequests.splice(requestIndex, 1);
        community.members.push(userId);
        return community.save();
    }
    async rejectRequest(id, userId) {
        const community = await this.communityModel.findById(id).exec();
        if (!community) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        const requestIndex = community.pendingRequests.indexOf(userId);
        if (requestIndex === -1) {
            throw new common_1.BadRequestException(`No pending request found for user with ID "${userId}"`);
        }
        community.pendingRequests.splice(requestIndex, 1);
        return community.save();
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(community_schema_1.Community.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CommunityService);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunitySchema = exports.Community = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose = __webpack_require__(9);
let Community = class Community {
};
exports.Community = Community;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Community.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Community.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Community.prototype, "creationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Community.prototype, "creator", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Community.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], Community.prototype, "members", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }] }),
    __metadata("design:type", Array)
], Community.prototype, "causes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], default: [] }),
    __metadata("design:type", Array)
], Community.prototype, "pendingRequests", void 0);
exports.Community = Community = __decorate([
    (0, mongoose_1.Schema)()
], Community);
exports.CommunitySchema = mongoose_1.SchemaFactory.createForClass(Community);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityController = void 0;
const common_1 = __webpack_require__(3);
const community_service_1 = __webpack_require__(16);
const create_community_dto_1 = __webpack_require__(19);
const update_community_dto_1 = __webpack_require__(20);
let CommunityController = class CommunityController {
    constructor(communityService) {
        this.communityService = communityService;
    }
    async create(createCommunityDto) {
        return this.communityService.create(createCommunityDto);
    }
    async findAll() {
        return this.communityService.findAll();
    }
    async findOne(id) {
        return this.communityService.findOne(id);
    }
    async update(id, updateCommunityDto) {
        return this.communityService.update(id, updateCommunityDto);
    }
    async remove(id) {
        return this.communityService.remove(id);
    }
    async requestJoin(id, userId) {
        return this.communityService.requestJoin(id, userId);
    }
    async acceptRequest(id, userId) {
        return this.communityService.acceptRequest(id, userId);
    }
    async rejectRequest(id, userId) {
        return this.communityService.rejectRequest(id, userId);
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_community_dto_1.CreateCommunityDto !== "undefined" && create_community_dto_1.CreateCommunityDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CommunityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CommunityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CommunityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_community_dto_1.UpdateCommunityDto !== "undefined" && update_community_dto_1.UpdateCommunityDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CommunityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], CommunityController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], CommunityController.prototype, "requestJoin", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], CommunityController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], CommunityController.prototype, "rejectRequest", null);
exports.CommunityController = CommunityController = __decorate([
    (0, common_1.Controller)('communities'),
    __metadata("design:paramtypes", [typeof (_a = typeof community_service_1.CommunityService !== "undefined" && community_service_1.CommunityService) === "function" ? _a : Object])
], CommunityController);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCommunityDto = void 0;
const class_validator_1 = __webpack_require__(13);
class CreateCommunityDto {
}
exports.CreateCommunityDto = CreateCommunityDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "creationDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCommunityDto.prototype, "creator", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCommunityDto.prototype, "members", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCommunityDto.prototype, "causes", void 0);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommunityDto = void 0;
const class_validator_1 = __webpack_require__(13);
class UpdateCommunityDto {
}
exports.UpdateCommunityDto = UpdateCommunityDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCommunityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCommunityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCommunityDto.prototype, "creationDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCommunityDto.prototype, "creator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCommunityDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCommunityDto.prototype, "members", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCommunityDto.prototype, "causes", void 0);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const action_service_1 = __webpack_require__(22);
const action_controller_1 = __webpack_require__(24);
const action_schema_1 = __webpack_require__(23);
let ActionModule = class ActionModule {
};
exports.ActionModule = ActionModule;
exports.ActionModule = ActionModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: action_schema_1.Action.name, schema: action_schema_1.ActionSchema }])],
        controllers: [action_controller_1.ActionController],
        providers: [action_service_1.ActionService],
    })
], ActionModule);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const action_schema_1 = __webpack_require__(23);
let ActionService = class ActionService {
    constructor(actionModel) {
        this.actionModel = actionModel;
    }
    async create(createActionDto) {
        const newAction = new this.actionModel(createActionDto);
        return newAction.save();
    }
    async findAll() {
        return this.actionModel.find().exec();
    }
    async findOne(id) {
        const action = this.actionModel.findById(id).exec();
        if (!action) {
            throw new common_1.NotFoundException(`Action with ID "${id}" not found`);
        }
        return action;
    }
    async update(id, updateActionDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException(`Invalid ID format: "${id}"`);
        }
        const updatedAction = await this.actionModel
            .findByIdAndUpdate(id, updateActionDto, { new: true, runValidators: true })
            .exec();
        if (!updatedAction) {
            throw new common_1.NotFoundException(`Action with ID "${id}" not found`);
        }
        return updatedAction;
    }
    async remove(id) {
        const action = await this.actionModel.findByIdAndDelete(id).exec();
        if (!action) {
            throw new common_1.NotFoundException(`Action with ID "${id}" not found`);
        }
    }
};
exports.ActionService = ActionService;
exports.ActionService = ActionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(action_schema_1.Action.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ActionService);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionSchema = exports.Action = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose = __webpack_require__(9);
let Action = class Action {
};
exports.Action = Action;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Action.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Action.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Action.prototype, "creationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true }),
    __metadata("design:type", String)
], Action.prototype, "cause", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Action.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Action.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Action.prototype, "goal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Action.prototype, "progress", void 0);
exports.Action = Action = __decorate([
    (0, mongoose_1.Schema)()
], Action);
exports.ActionSchema = mongoose_1.SchemaFactory.createForClass(Action);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionController = void 0;
const common_1 = __webpack_require__(3);
const action_service_1 = __webpack_require__(22);
const create_action_dto_1 = __webpack_require__(25);
const update_action_dto_1 = __webpack_require__(26);
let ActionController = class ActionController {
    constructor(actionService) {
        this.actionService = actionService;
    }
    async create(createActionDto) {
        return this.actionService.create(createActionDto);
    }
    async findAll() {
        return this.actionService.findAll();
    }
    async findOne(id) {
        return this.actionService.findOne(id);
    }
    async update(id, updateActionDto) {
        return this.actionService.update(id, updateActionDto);
    }
    async remove(id) {
        return this.actionService.remove(id);
    }
};
exports.ActionController = ActionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_action_dto_1.CreateActionDto !== "undefined" && create_action_dto_1.CreateActionDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ActionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ActionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ActionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_action_dto_1.UpdateActionDto !== "undefined" && update_action_dto_1.UpdateActionDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ActionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "remove", null);
exports.ActionController = ActionController = __decorate([
    (0, common_1.Controller)('actions'),
    __metadata("design:paramtypes", [typeof (_a = typeof action_service_1.ActionService !== "undefined" && action_service_1.ActionService) === "function" ? _a : Object])
], ActionController);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateActionDto = void 0;
const class_validator_1 = __webpack_require__(13);
class CreateActionDto {
}
exports.CreateActionDto = CreateActionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "cause", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateActionDto.prototype, "goal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateActionDto.prototype, "progress", void 0);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateActionDto = void 0;
const mapped_types_1 = __webpack_require__(27);
const create_action_dto_1 = __webpack_require__(25);
class UpdateActionDto extends (0, mapped_types_1.PartialType)(create_action_dto_1.CreateActionDto) {
}
exports.UpdateActionDto = UpdateActionDto;


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityRequestsModule = void 0;
const common_1 = __webpack_require__(3);
const community_requests_service_1 = __webpack_require__(29);
const community_requests_controller_1 = __webpack_require__(31);
const mongoose_1 = __webpack_require__(7);
const community_requests_schema_1 = __webpack_require__(30);
const community_schema_1 = __webpack_require__(17);
let CommunityRequestsModule = class CommunityRequestsModule {
};
exports.CommunityRequestsModule = CommunityRequestsModule;
exports.CommunityRequestsModule = CommunityRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: community_requests_schema_1.CommunityRequests.name, schema: community_requests_schema_1.CommunityRequestsSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: community_schema_1.Community.name, schema: community_schema_1.CommunitySchema }])],
        controllers: [community_requests_controller_1.CommunityRequestsController],
        providers: [community_requests_service_1.CommunityRequestsService],
    })
], CommunityRequestsModule);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityRequestsService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const community_requests_schema_1 = __webpack_require__(30);
const community_schema_1 = __webpack_require__(17);
let CommunityRequestsService = class CommunityRequestsService {
    constructor(requestModel, communityModel) {
        this.requestModel = requestModel;
        this.communityModel = communityModel;
    }
    async createRequest(createRequestDto) {
        return this.requestModel.create(createRequestDto);
    }
    async findAllPending() {
        return this.requestModel.find({ status: 'Pending' }).exec();
    }
    async findOne(id) {
        const communityRequests = await this.requestModel.findById(id).exec();
        if (!communityRequests) {
            throw new common_1.NotFoundException(`Community with ID "${id}" not found`);
        }
        return communityRequests;
    }
    async approveRequest(requestId) {
        const request = await this.requestModel.findById(requestId).exec();
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        const community = await this.communityModel.create({
            name: request.name,
            description: request.description,
            creationDate: new Date(),
            creator: request.creator,
            status: 'Active',
            members: [],
            causes: [],
        });
        request.status = 'Approved';
        await request.save();
        return community;
    }
    async rejectRequest(requestId) {
        const request = await this.requestModel.findByIdAndUpdate(requestId, { status: 'Rejected' }, { new: true }).exec();
        if (!request) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        return request;
    }
};
exports.CommunityRequestsService = CommunityRequestsService;
exports.CommunityRequestsService = CommunityRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(community_requests_schema_1.CommunityRequests.name)),
    __param(1, (0, mongoose_1.InjectModel)(community_schema_1.Community.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], CommunityRequestsService);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityRequestsSchema = exports.CommunityRequests = void 0;
const mongoose_1 = __webpack_require__(7);
let CommunityRequests = class CommunityRequests {
};
exports.CommunityRequests = CommunityRequests;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CommunityRequests.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CommunityRequests.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CommunityRequests.prototype, "creator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending' }),
    __metadata("design:type", String)
], CommunityRequests.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CommunityRequests.prototype, "requestDate", void 0);
exports.CommunityRequests = CommunityRequests = __decorate([
    (0, mongoose_1.Schema)()
], CommunityRequests);
exports.CommunityRequestsSchema = mongoose_1.SchemaFactory.createForClass(CommunityRequests);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunityRequestsController = void 0;
const common_1 = __webpack_require__(3);
const community_requests_service_1 = __webpack_require__(29);
const create_community_request_dto_1 = __webpack_require__(32);
let CommunityRequestsController = class CommunityRequestsController {
    constructor(requestService) {
        this.requestService = requestService;
    }
    async createRequest(createRequestDto) {
        return this.requestService.createRequest(createRequestDto);
    }
    async findAllPending() {
        return this.requestService.findAllPending();
    }
    async findOne(id) {
        return this.requestService.findOne(id);
    }
    async approveRequest(id) {
        return this.requestService.approveRequest(id);
    }
    async rejectRequest(id) {
        return this.requestService.rejectRequest(id);
    }
};
exports.CommunityRequestsController = CommunityRequestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_community_request_dto_1.CreateCommunityRequestsDto !== "undefined" && create_community_request_dto_1.CreateCommunityRequestsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CommunityRequestsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunityRequestsController.prototype, "findAllPending", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CommunityRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunityRequestsController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunityRequestsController.prototype, "rejectRequest", null);
exports.CommunityRequestsController = CommunityRequestsController = __decorate([
    (0, common_1.Controller)('community-requests'),
    __metadata("design:paramtypes", [typeof (_a = typeof community_requests_service_1.CommunityRequestsService !== "undefined" && community_requests_service_1.CommunityRequestsService) === "function" ? _a : Object])
], CommunityRequestsController);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCommunityRequestsDto = void 0;
const class_validator_1 = __webpack_require__(13);
class CreateCommunityRequestsDto {
    constructor() {
        this.status = 'Pending';
    }
}
exports.CreateCommunityRequestsDto = CreateCommunityRequestsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityRequestsDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityRequestsDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCommunityRequestsDto.prototype, "creator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityRequestsDto.prototype, "status", void 0);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const event_service_1 = __webpack_require__(34);
const event_controller_1 = __webpack_require__(36);
const event_schema_1 = __webpack_require__(35);
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: event_schema_1.Event.name, schema: event_schema_1.EventSchema }])],
        controllers: [event_controller_1.EventController],
        providers: [event_service_1.EventService],
    })
], EventModule);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const event_schema_1 = __webpack_require__(35);
let EventService = class EventService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async create(createEventDto) {
        const newEvent = new this.eventModel(createEventDto);
        return newEvent.save();
    }
    async findAll() {
        return this.eventModel.find().exec();
    }
    async findOne(id) {
        const event = this.eventModel.findById(id).exec();
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException(`Invalid ID format: "${id}"`);
        }
        const updatedEvent = await this.eventModel
            .findById(id, updateEventDto, { new: true, runValidators: true })
            .exec();
        if (!updatedEvent) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
        return updatedEvent;
    }
    async remove(id) {
        const event = await this.eventModel.findByIdAndDelete(id).exec();
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EventService);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose = __webpack_require__(9);
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Event.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }),
    __metadata("design:type", String)
], Event.prototype, "community", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] }),
    __metadata("design:type", Array)
], Event.prototype, "actions", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)()
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventController = void 0;
const common_1 = __webpack_require__(3);
const event_service_1 = __webpack_require__(34);
const create_event_dto_1 = __webpack_require__(37);
const update_event_dto_1 = __webpack_require__(38);
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async create(createEventDto) {
        return this.eventService.create(createEventDto);
    }
    findAll() {
        return this.eventService.findAll();
    }
    findOne(id) {
        return this.eventService.findOne(+id);
    }
    update(id, updateEventDto) {
        return this.eventService.update(+id, updateEventDto);
    }
    remove(id) {
        return this.eventService.remove(+id);
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_event_dto_1.CreateEventDto !== "undefined" && create_event_dto_1.CreateEventDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], EventController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_event_dto_1.UpdateEventDto !== "undefined" && update_event_dto_1.UpdateEventDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "remove", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)('event'),
    __metadata("design:paramtypes", [typeof (_a = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _a : Object])
], EventController);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEventDto = void 0;
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateEventDto = void 0;
const mapped_types_1 = __webpack_require__(27);
const create_event_dto_1 = __webpack_require__(37);
class UpdateEventDto extends (0, mapped_types_1.PartialType)(create_event_dto_1.CreateEventDto) {
}
exports.UpdateEventDto = UpdateEventDto;


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const dotenv = __webpack_require__(39);
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001);
}
bootstrap();

})();

/******/ })()
;