import { Destination } from '../../destination/destination.entity.js';
import dataSource from '../data-source.js';

const PROVINCES = [
  {
    code: 'an-giang',
    name: 'An Giang',
    shortDescription:
      'Tỉnh miền Tây nổi tiếng với rừng tràm Trà Sư, núi Sam – Châu Đốc linh thiêng và văn hóa đặc sắc của người Khmer, Chăm.',
  },
  {
    code: 'bac-ninh',
    name: 'Bắc Ninh',
    shortDescription:
      'Quê hương dân ca Quan họ, nhiều làng nghề truyền thống và di tích lịch sử lâu đời.',
  },
  {
    code: 'ca-mau',
    name: 'Cà Mau',
    shortDescription:
      'Điểm cực Nam Tổ quốc với rừng ngập mặn, Mũi Cà Mau và hệ sinh thái đa dạng đặc trưng vùng đất cuối trời.',
  },
  {
    code: 'can-tho',
    name: 'Cần Thơ',
    shortDescription:
      'Thủ phủ miền Tây với chợ nổi Cái Răng, miệt vườn trái cây và văn hóa sông nước đặc trưng.',
  },
  {
    code: 'cao-bang',
    name: 'Cao Bằng',
    shortDescription:
      'Nổi tiếng với thác Bản Giốc hùng vĩ, hang Pác Bó lịch sử và cảnh quan núi non trùng điệp.',
  },
  {
    code: 'da-nang',
    name: 'Đà Nẵng',
    shortDescription:
      'Thành phố biển hiện đại, nổi bật với bãi biển Mỹ Khê, Bà Nà Hills và nhiều cây cầu độc đáo.',
  },
  {
    code: 'dak-lak',
    name: 'Đắk Lắk',
    shortDescription:
      'Thủ phủ cà phê Việt Nam, nổi bật với văn hóa cồng chiêng và hồ Lắk, Buôn Đôn huyền thoại.',
  },
  {
    code: 'dien-bien',
    name: 'Điện Biên',
    shortDescription:
      'Nổi tiếng với chiến trường Điện Biên Phủ lịch sử và cảnh quan núi rừng Tây Bắc hoang sơ, hùng tráng.',
  },
  {
    code: 'dong-nai',
    name: 'Đồng Nai',
    shortDescription:
      'Tỉnh công nghiệp phát triển với khu du lịch Bửu Long, rừng quốc gia Cát Tiên và sông Đồng Nai.',
  },
  {
    code: 'dong-thap',
    name: 'Đồng Tháp',
    shortDescription:
      'Quê hương sen hồng, nổi bật với Đồng Tháp Mười, làng hoa Sa Đéc và nhiều khu du lịch sinh thái.',
  },
  {
    code: 'gia-lai',
    name: 'Gia Lai',
    shortDescription:
      'Cao nguyên lộng gió với Biển Hồ Pleiku, văn hóa cồng chiêng Tây Nguyên và rừng núi hùng vĩ.',
  },
  {
    code: 'ha-noi',
    name: 'Hà Nội',
    shortDescription:
      'Thủ đô nghìn năm văn hiến với nhiều di tích lịch sử, phố cổ đặc trưng và nền ẩm thực phong phú như phở, bún chả.',
  },
  {
    code: 'ha-tinh',
    name: 'Hà Tĩnh',
    shortDescription:
      'Miền đất miền Trung nổi bật với biển Thiên Cầm, núi Hồng Lĩnh và nhiều di sản văn hóa dân gian.',
  },
  {
    code: 'hai-phong',
    name: 'Hải Phòng',
    shortDescription: "Thành phố cảng sôi động với đảo Cát Bà, bãi biển Đồ Sơn và nền ẩm thực đặc trưng như bánh đa cua, nem cua bể.",
  },
  {
    code: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    shortDescription:
      'Trung tâm kinh tế sôi động nhất cả nước, kết hợp giữa nhịp sống hiện đại và nhiều công trình lịch sử.',
  },
  {
    code: 'hue',
    name: 'Huế',
    shortDescription:
      'Cố đô nổi tiếng với quần thể di tích triều Nguyễn, nhã nhạc cung đình và nét ẩm thực tinh tế, đậm chất hoàng gia.',
  },
  {
    code: 'hung-yen',
    name: 'Hưng Yên',
    shortDescription:
      'Vùng đất nhãn lồng nổi tiếng, mang đậm dấu ấn văn hóa đồng bằng Bắc Bộ xưa.',
  },
  {
    code: 'khanh-hoa',
    name: 'Khánh Hòa',
    shortDescription:
      'Thiên đường du lịch biển với Nha Trang, vịnh Vân Phong và nhiều hòn đảo đẹp.',
  },
  {
    code: 'lai-chau',
    name: 'Lai Châu',
    shortDescription:
      'Vùng núi Tây Bắc hùng vĩ với nhiều dân tộc thiểu số, ruộng bậc thang và những cung đường đèo ngoạn mục.',
  },
  {
    code: 'lam-dong',
    name: 'Lâm Đồng',
    shortDescription:
      'Nổi tiếng với Đà Lạt mộng mơ, khí hậu mát mẻ quanh năm và những đồi thông, thác nước thơ mộng.',
  },
  {
    code: 'lang-son',
    name: 'Lạng Sơn',
    shortDescription:
      'Tỉnh biên giới phía Bắc với nhiều hang động đẹp, chợ cửa khẩu sầm uất và văn hóa Tày – Nùng đặc trưng.',
  },
  {
    code: 'lao-cai',
    name: 'Lào Cai',
    shortDescription:
      'Nơi có Sa Pa mù sương, đỉnh Fansipan hùng vĩ và bản sắc văn hóa phong phú của các dân tộc vùng cao.',
  },
  {
    code: 'nghe-an',
    name: 'Nghệ An',
    shortDescription:
      'Quê hương Chủ tịch Hồ Chí Minh, có thiên nhiên đa dạng từ biển Cửa Lò đến rừng quốc gia Pù Mát.',
  },
  {
    code: 'ninh-binh',
    name: 'Ninh Bình',
    shortDescription:
      "Được mệnh danh là 'Hạ Long trên cạn' với Tràng An, Tam Cốc và nhiều di tích lịch sử cố đô Hoa Lư.",
  },
  {
    code: 'phu-tho',
    name: 'Phú Thọ',
    shortDescription:
      'Đất Tổ Hùng Vương, nơi diễn ra lễ hội Đền Hùng linh thiêng và lưu giữ nhiều giá trị văn hóa cổ truyền.',
  },
  {
    code: 'quang-ngai',
    name: 'Quảng Ngãi',
    shortDescription:
      'Nơi có đảo Lý Sơn nổi tiếng với tỏi và cảnh quan biển đảo hoang sơ, cùng nhiều di tích lịch sử.',
  },
  {
    code: 'quang-ninh',
    name: 'Quảng Ninh',
    shortDescription:
      'Nổi tiếng với Vịnh Hạ Long – kỳ quan thiên nhiên thế giới, cùng nhiều bãi biển và điểm du lịch tâm linh.',
  },
  {
    code: 'quang-tri',
    name: 'Quảng Trị',
    shortDescription:
      'Mảnh đất lịch sử với Thành cổ Quảng Trị, cầu Hiền Lương và nhiều di tích chiến tranh.',
  },
  {
    code: 'son-la',
    name: 'Sơn La',
    shortDescription:
      'Vùng đất cao nguyên mát mẻ, nổi bật với Mộc Châu, đồi chè xanh mướt và văn hóa dân tộc Thái đặc sắc.',
  },
  {
    code: 'tay-ninh',
    name: 'Tây Ninh',
    shortDescription:
      'Nổi tiếng với núi Bà Đen, Tòa Thánh Cao Đài và nhiều món ăn đặc sản như bánh tráng phơi sương.',
  },
  {
    code: 'thai-nguyen',
    name: 'Thái Nguyên',
    shortDescription:
      'Thủ phủ chè của Việt Nam, nổi tiếng với đồi chè xanh mướt và hồ Núi Cốc thơ mộng.',
  },
  {
    code: 'thanh-hoa',
    name: 'Thanh Hoá',
    shortDescription:
      'Vùng đất địa linh nhân kiệt với thành nhà Hồ, biển Sầm Sơn và nhiều di tích lịch sử lâu đời.',
  },
  {
    code: 'tuyen-quang',
    name: 'Tuyên Quang',
    shortDescription:
      'Vùng đất cách mạng với Tân Trào lịch sử, hồ Na Hang thơ mộng và lễ hội đặc sắc.',
  },
  {
    code: 'vinh-long',
    name: 'Vĩnh Long',
    shortDescription:
      'Vùng đất miệt vườn trù phú, nổi tiếng với trái cây ngọt lành và du lịch sinh thái sông nước.',
  },
];

async function main() {
  await dataSource.initialize();

  try {
    const result = await dataSource
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(PROVINCES)
      .orUpdate(['name', 'short_description'], ['code'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .returning('id')
      .execute();

    const changed = result.raw.length;
    console.log(
      `Seed destinations: ${changed} inserted or updated, ${PROVINCES.length - changed} unchanged.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

await main();