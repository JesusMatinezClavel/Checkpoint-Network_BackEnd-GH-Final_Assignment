// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";

export const seedControlUploads = async () => {

    const users = await User.find()

    for (const user of users) {

        const cube = new Upload()
        cube.name = `${user.name}-cube.fbx`
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

        const updateUser = await User.findOne({
            where: {
                id: user.id
            },
            relations: [
                'likes'
            ]
        })
        updateUser!.likes = [...[cube]]
        await User.save(updateUser!)
    }

    console.log('------------------------');
    console.log('Control uploads created!');
    console.log("--- User's likes updated");
    console.log('------------------------');

}