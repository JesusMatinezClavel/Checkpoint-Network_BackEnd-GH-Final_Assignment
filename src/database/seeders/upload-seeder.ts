// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";
import fs from "fs";
import path from "path";

const __fileName = __filename
const __filePath = path.dirname(__fileName)

export const seedControlUploads = async () => {

    const users = await User.find()

    for (const user of users) {

        const userFolder = path.join(__dirname, '../../../', '3D-Models', user.name)
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true })
        }

        const cube = new Upload();
        cube.name = `cube.fbx`;
        cube.description = 'basic cube with beveled vertices';
        cube.user = { id: user.id } as User;
        cube.liked = [{ id: user.id } as User];
        cube.createdAt = new Date();
        cube.updatedAt = new Date();

        await Upload.save(cube);

        const updateUser = await User.findOne({
            where: { id: user.id },
            relations: ['likes']
        });

        if (updateUser) {
            updateUser.likes = [...updateUser.likes, cube];
            await User.save(updateUser);
        }
    }


    console.log('------------------------');
    console.log('Control uploads created!');
    console.log("--- User's likes updated");
    console.log('------------------------');

}
