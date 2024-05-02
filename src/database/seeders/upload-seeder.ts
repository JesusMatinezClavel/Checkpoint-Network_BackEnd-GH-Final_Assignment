import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";

export const seedControlUploads = async () => {

    const users = await User.find()

    for (const user of users) {

        const cube = new Upload()
        cube.name = `${user.name} - cube`
        cube.path = '../../../3D-models/Seeders/cube.fbx'
        cube.description = 'basic cube with beveled vertices'
        cube.user = {
            id: user.id
        } as User
        cube.liked = [{
            id: user.id
        } as User]
        cube.createdAt = new Date()
        cube.updatedAt = new Date()
        await Upload.save(cube)


        const icoSphere = new Upload()
        icoSphere.name = `${user.name} - icoSphere`
        icoSphere.path = '../../../3D-models/Seeders/icoSphere.fbx'
        icoSphere.description = 'basic icoSphere with beveled edges'
        icoSphere.user = {
            id: user.id
        } as User
        icoSphere.liked = [{
            id: user.id
        } as User]
        icoSphere.createdAt = new Date()
        icoSphere.updatedAt = new Date()
        await Upload.save(icoSphere)

        const updateUser = await User.findOne({
            where: {
                id: user.id
            },
            relations: [
                'likes'
            ]
        })
        updateUser!.likes = [...[cube, icoSphere]]
        await User.save(updateUser!)
    }

    console.log('------------------------');
    console.log('Control uploads created!');
    console.log("--- User's likes updated");
    console.log('------------------------');

}