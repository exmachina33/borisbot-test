import BoxModel from "@/store/models/box/BoxModel";

export default class Box extends BoxModel {
    async delete() {
        await this.deleteRelations();
        await this.$delete()
    }

    async deleteRelations(){
        [...this.toThreads, ...this.fromThreads].forEach(thread => thread.$delete())
    }

}
